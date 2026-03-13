import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { UsersDAO } from "../db/users.js";
import {
  hashPassword,
  verifyPassword,
  hashToken,
  createAccessToken,
  verifyAccessToken,
} from "../utils/auth-utils.js";
import { v4 as uuidv4 } from "uuid";

const AUTH_SECRET = process.env.AUTH_SECRET || "dev-secret";
const ACCESS_TOKEN_EXPIRES = Number(
  process.env.ACCESS_TOKEN_EXPIRES_SECONDS ?? 900,
); // 15m
const REFRESH_TOKEN_EXPIRES_SECONDS = Number(
  process.env.REFRESH_TOKEN_EXPIRES_SECONDS ?? 30 * 24 * 3600,
); // 30d

const usersDao = new UsersDAO();

const toUserResponse = (user: any) => ({
  id: user.id,
  email: user.email,
  name: user.name ?? undefined,
  isActive: user.isActive,
  isEmailVerified: user.isEmailVerified,
  createdTimestamp: user.createdTimestamp.toISOString(),
  updatedTimestamp: user.updatedTimestamp?.toISOString(),
});

export const registerRoute: RegisterRoute = async ({ body }) => {
  const existing = await usersDao.findByEmail(body.email);

  if (existing) {
    return { status: 400, body: {} };
  }

  const passwordHash = hashPassword(body.password);
  const created = await usersDao.createUser({
    email: body.email,
    passwordHash,
    name: body.name ?? null,
    isActive: true,
    isEmailVerified: false,
  });

  return { status: 201, body: toUserResponse(created) };
};

export const loginRoute: LoginRoute = async ({ body }) => {
  const user = await usersDao.findByEmail(body.email);

  if (!user || !user.passwordHash) {
    return { status: 401, body: {} };
  }

  if (!verifyPassword(body.password, user.passwordHash)) {
    return { status: 401, body: {} };
  }

  const refreshToken = uuidv4();
  const refreshTokenHash = hashToken(refreshToken, AUTH_SECRET);
  const sessionId = uuidv4();
  const refreshExpires = new Date(
    Date.now() + REFRESH_TOKEN_EXPIRES_SECONDS * 1000,
  );

  await usersDao.createSession({
    id: sessionId,
    userId: user.id,
    tokenHash: refreshTokenHash,
    expiresTimestamp: refreshExpires,
  });

  const accessToken = createAccessToken(
    { sub: user.id },
    AUTH_SECRET,
    ACCESS_TOKEN_EXPIRES,
  );

  return {
    status: 200,
    body: {
      user: toUserResponse(user),
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: ACCESS_TOKEN_EXPIRES,
      },
    },
  };
};

export const refreshTokenRoute: RefreshTokenRoute = async (request) => {
  const { body } = request;
  const tokenHash = hashToken(body.refreshToken, AUTH_SECRET);
  const session = await usersDao.findSessionByTokenHash(tokenHash);

  if (!session) return { status: 401, body: {} };

  if (session.expiresTimestamp && session.expiresTimestamp < new Date()) {
    return { status: 401, body: {} };
  }

  const user = await usersDao.findById(session.userId);
  if (!user) return { status: 401, body: {} };

  // rotate refresh token
  const newRefreshToken = uuidv4();
  const newRefreshHash = hashToken(newRefreshToken, AUTH_SECRET);
  const newExpires = new Date(
    Date.now() + REFRESH_TOKEN_EXPIRES_SECONDS * 1000,
  );
  await usersDao.updateSessionToken(session.id, newRefreshHash, newExpires);

  const accessToken = createAccessToken(
    { sub: user.id },
    AUTH_SECRET,
    ACCESS_TOKEN_EXPIRES,
  );

  return {
    status: 200,
    body: {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRES,
    },
  };
};

export const logoutRoute: LogoutRoute = async (request) => {
  const { body } = request;
  const tokenHash = hashToken(body.refreshToken, AUTH_SECRET);
  await usersDao.deleteSessionByTokenHash(tokenHash);
  return { status: 204, body: undefined };
};

export const meRoute: MeRoute = async (request) => {
  const headers = request.headers as Record<string, unknown>;
  const auth =
    (headers as any)?.authorization || (headers as any)?.Authorization;

  if (!auth || !auth.toString().startsWith("Bearer "))
    return { status: 401, body: {} };

  const token = auth.toString().slice("Bearer ".length);
  const payload = verifyAccessToken(token, AUTH_SECRET);

  if (!payload) return { status: 401, body: {} };

  const userId = payload.sub as number;
  const user = await usersDao.findById(userId);

  if (!user) return { status: 401, body: {} };

  return { status: 200, body: toUserResponse(user) };
};

export const oauthCallbackRoute: OAuthCallbackRoute = async (request) => {
  const { query } = request;
  const provider = query.provider;
  const code = query.code;
  if (provider !== "google") return { status: 400, body: {} };

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "";

  if (!clientId || !clientSecret || !redirectUri) {
    return { status: 500, body: {} };
  }

  // Exchange code for tokens
  const params = new URLSearchParams();
  params.set("code", code as string);
  params.set("client_id", clientId);
  params.set("client_secret", clientSecret);
  params.set("redirect_uri", redirectUri);
  params.set("grant_type", "authorization_code");

  const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!tokenResp.ok) return { status: 400, body: {} };
  const tokenJson = await tokenResp.json();
  const providerAccessToken = tokenJson.access_token;

  const profileResp = await fetch(
    "https://openidconnect.googleapis.com/v1/userinfo",
    {
      headers: { Authorization: `Bearer ${providerAccessToken}` },
    },
  );
  if (!profileResp.ok) return { status: 400, body: {} };
  const profile = await profileResp.json();

  // profile.sub is provider user id
  const providerId = profile.sub as string;
  const providerRow = await usersDao.findAuthProvider("google", providerId);

  let user: any;
  if (providerRow) {
    user = await usersDao.findById(providerRow.userId);
  } else {
    // try to find by email
    const email = profile.email as string | undefined;
    if (email) {
      const existing = await usersDao.findByEmail(email);
      if (existing) {
        user = existing;
      }
    }
    if (!user) {
      const created = await usersDao.createUser({
        email: profile.email ?? `no-email-${providerId}@example.com`,
        passwordHash: null,
        name: profile.name ?? null,
        isActive: true,
        isEmailVerified: profile.email_verified ?? false,
      });
      user = created;
    }

    await usersDao.createAuthProvider({
      userId: user.id,
      provider: "google",
      providerId,
      profile,
    });
  }

  // create session and return tokens
  const refreshToken = uuidv4();
  const refreshHash = hashToken(refreshToken, AUTH_SECRET);
  const sessionId = uuidv4();
  const refreshExpires = new Date(
    Date.now() + REFRESH_TOKEN_EXPIRES_SECONDS * 1000,
  );
  await usersDao.createSession({
    id: sessionId,
    userId: user.id,
    tokenHash: refreshHash,
    expiresTimestamp: refreshExpires,
  });

  const accessToken = createAccessToken(
    { sub: user.id },
    AUTH_SECRET,
    ACCESS_TOKEN_EXPIRES,
  );

  return {
    status: 200,
    body: {
      user: toUserResponse(user),
      tokens: { accessToken, refreshToken, expiresIn: ACCESS_TOKEN_EXPIRES },
    },
  };
};

export const getProvidersRoute: GetProvidersRoute = async () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    `http://localhost:${process.env.CORE_SERVICE_PORT || 3333}/v1/auth/oauth2/callback`;

  const googleUrl = clientId
    ? `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(
        redirectUri,
      )}&response_type=code&scope=${encodeURIComponent("openid email profile")}&access_type=offline&prompt=consent`
    : "";

  return {
    status: 200,
    body: [{ provider: "google", authorizationUrl: googleUrl }],
  };
};

type RegisterRoute = AppRouteImplementation<typeof contract.register>;
type LoginRoute = AppRouteImplementation<typeof contract.login>;
type RefreshTokenRoute = AppRouteImplementation<typeof contract.refreshToken>;
type LogoutRoute = AppRouteImplementation<typeof contract.logout>;
type MeRoute = AppRouteImplementation<typeof contract.me>;
type OAuthCallbackRoute = AppRouteImplementation<typeof contract.oauthCallback>;
type GetProvidersRoute = AppRouteImplementation<typeof contract.getProviders>;
