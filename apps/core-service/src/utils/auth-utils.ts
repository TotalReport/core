import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "crypto";

function base64UrlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(str: string): Buffer {
  let s = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = s.length % 4;
  if (pad) s += "=".repeat(4 - pad);
  return Buffer.from(s, "base64");
}

export const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64);
  return `${salt}:${derived.toString("hex")}`;
};

export const verifyPassword = (password: string, stored: string): boolean => {
  const parts = stored.split(":");
  if (parts.length !== 2) return false;
  const salt = parts[0]!;
  const keyHex = parts[1]!;
  try {
    const derived = scryptSync(password, salt, 64);
    const keyBuf = Buffer.from(keyHex, "hex");
    return timingSafeEqual(derived, keyBuf);
  } catch {
    return false;
  }
};

export const createAccessToken = (
  payload: Record<string, unknown>,
  secret: string,
  expiresInSeconds: number,
): string => {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const payloadWithExp = { ...payload, exp };

  const headerB = base64UrlEncode(Buffer.from(JSON.stringify(header)));
  const payloadB = base64UrlEncode(Buffer.from(JSON.stringify(payloadWithExp)));

  const signature = createHmac("sha256", secret).update(`${headerB}.${payloadB}`).digest();
  const signatureB = base64UrlEncode(signature);
  return `${headerB}.${payloadB}.${signatureB}`;
};

export const verifyAccessToken = (
  token: string,
  secret: string,
): Record<string, unknown> | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [headerB, payloadB, sigB] = parts;

    if (!headerB || !payloadB || !sigB) return null;

    const expectedSig = createHmac("sha256", secret).update(`${headerB}.${payloadB}`).digest();
    const sigBuf = base64UrlDecode(sigB);
    if (!timingSafeEqual(expectedSig, sigBuf)) return null;

    const payloadBuf = base64UrlDecode(payloadB);
    const payload = JSON.parse(payloadBuf.toString("utf8"));
    if (typeof payload.exp !== "number") return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (err) {
    return null;
  }
};

export const hashToken = (token: string, secret: string): string => {
  return createHmac("sha256", secret).update(token).digest("hex");
};
