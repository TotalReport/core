import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { initContract } from "@ts-rest/core";
import { z } from "zod";

extendZodWithOpenApi(z);

const contract = initContract();

export const UserSchema = z.object({
  id: z.number().int(),
  email: z.string().email(),
  name: z.string().min(1).max(256).optional(),
  isActive: z.boolean(),
  isEmailVerified: z.boolean(),
  createdTimestamp: z.string().datetime({ offset: true }),
  updatedTimestamp: z.string().datetime({ offset: true }).optional(),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(256).optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const TokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number().int(),
});

export const RefreshSchema = z.object({
  refreshToken: z.string(),
});

export const OAuthCallbackQuery = z.object({
  provider: z.string(),
  code: z.string(),
  state: z.string().optional(),
});

export const register = contract.mutation({
  summary: "Register a new user with email and password.",
  method: "POST",
  path: "/v1/auth/register",
  body: RegisterSchema,
  responses: {
    201: UserSchema,
    400: z.object({}),
  },
});

export const login = contract.mutation({
  summary: "Login with email and password.",
  method: "POST",
  path: "/v1/auth/login",
  body: LoginSchema,
  responses: {
    200: z.object({ user: UserSchema, tokens: TokenResponseSchema }),
    401: z.object({}),
  },
});

export const refreshToken = contract.mutation({
  summary: "Refresh authentication tokens using a refresh token.",
  method: "POST",
  path: "/v1/auth/refresh",
  body: RefreshSchema,
  responses: {
    200: TokenResponseSchema,
    401: z.object({}),
  },
});

export const logout = contract.mutation({
  summary: "Logout and revoke refresh token.",
  method: "POST",
  path: "/v1/auth/logout",
  body: RefreshSchema,
  responses: {
    204: z.void(),
    400: z.object({}),
  },
});

export const me = contract.query({
  summary: "Get current authenticated user.",
  method: "GET",
  path: "/v1/auth/me",
  responses: {
    200: UserSchema,
    401: z.object({}),
  },
});

export const oauthCallback = contract.query({
  summary: "OAuth2 callback endpoint (exchanges code for tokens).",
  method: "GET",
  path: "/v1/auth/oauth2/callback",
  query: OAuthCallbackQuery,
  responses: {
    200: z.object({ user: UserSchema, tokens: TokenResponseSchema }),
    400: z.object({}),
  },
});

export const getProviders = contract.query({
  summary: "List available OAuth providers and authorization URL info.",
  method: "GET",
  path: "/v1/auth/providers",
  responses: {
    200: z.array(z.object({ provider: z.string(), authorizationUrl: z.string().url() })),
  },
});
