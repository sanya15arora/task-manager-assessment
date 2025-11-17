import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

type AccessPayload = {
    userId: number;
    email: string;
};

type RefreshPayload = {
    userId: number;
};

type AccessTokenDecoded = AccessPayload & {
    iat: number;
    exp: number;
};

type RefreshTokenDecoded = RefreshPayload & {
    iat: number;
    exp: number;
};

export function signAccessToken(payload: AccessPayload) {
    return jwt.sign(payload, ENV.JWT_ACCESS_SECRET, {
        expiresIn: ENV.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });
}

export function signRefreshToken(payload: RefreshPayload) {
    return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
        expiresIn: ENV.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });
}

export function verifyAccessToken(token: string): AccessTokenDecoded {
    try {
        return jwt.verify(token, ENV.JWT_ACCESS_SECRET) as AccessTokenDecoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            const err: any = new Error("Access token expired");
            err.status = 401;
            throw err;
        }
        if (error instanceof jwt.JsonWebTokenError) {
            const err: any = new Error("Invalid access token");
            err.status = 401;
            throw err;
        }
        throw error;
    }
}

export function verifyRefreshToken(token: string): RefreshTokenDecoded {
    try {
        return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as RefreshTokenDecoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            const err: any = new Error("Refresh token expired");
            err.status = 401;
            throw err;
        }
        if (error instanceof jwt.JsonWebTokenError) {
            const err: any = new Error("Invalid refresh token");
            err.status = 401;
            throw err;
        }
        throw error;
    }
}