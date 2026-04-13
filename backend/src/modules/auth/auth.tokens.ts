import crypto from "crypto";
import jwt from "jsonwebtoken";

export type UserType = "admin" | "client";

export type AccessTokenPayload = {
  sub: string;
  typ: "access";
  userType: UserType;
};

export type RefreshTokenPayload = {
  sub: string;
  typ: "refresh";
  userType: UserType;
  jti: string;
};

export function newJti(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function signAccessToken(payload: Omit<AccessTokenPayload, "typ">): string {
  return jwt.sign(
    { ...payload, typ: "access" as const },
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: "15m" },
  );
}

export function signRefreshToken(payload: Omit<RefreshTokenPayload, "typ">, remember: boolean): string {
  return jwt.sign(
    { ...payload, typ: "refresh" as const },
    process.env.JWT_REFRESH_SECRET_KEY as string,
    { expiresIn: remember ? "30d" : "7d" },
  );
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as AccessTokenPayload;
  if (decoded.typ !== "access") throw new Error("Invalid access token type");
  return decoded;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY as string) as RefreshTokenPayload;
  if (decoded.typ !== "refresh") throw new Error("Invalid refresh token type");
  return decoded;
}

