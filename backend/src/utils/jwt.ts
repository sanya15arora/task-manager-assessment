import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

type AccessPayload = {
    userId: number;
    email?: string;
};

export function signAccessToken(payload: AccessPayload) {
    return jwt.sign(payload, ENV.JWT_ACCESS_SECRET, {
        expiresIn: ENV.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });
}

export function signRefreshToken(payload: { userId: number }) {
    return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
        expiresIn: ENV.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });
}

export function verifyAccessToken(token: string) {
    return jwt.verify(token, ENV.JWT_ACCESS_SECRET) as AccessPayload;
}

export function verifyRefreshToken(token: string) {
    return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as { userId: number; iat: number; exp: number };
}

