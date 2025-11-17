import { prisma } from "../../prisma/client";
import { hashPassword, comparePassword } from "../../utils/bcrypt";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import crypto from "crypto";

function hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

export class AuthService {
    // REGISTER
    static async register(name: string | undefined, email: string, password: string) {
        if (!name || !name.trim()) {
            const err: any = new Error("Name is required");
            err.status = 400;
            throw err;
        }

        if (!password || password.length < 8) {
            const err: any = new Error("Password must be at least 8 characters");
            err.status = 400;
            throw err;
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            const err: any = new Error("Email already in use");
            err.status = 409;
            throw err;
        }

        const passwordHash = await hashPassword(password);

        const user = await prisma.user.create({
            data: { name, email, password: passwordHash },
        });

        return { id: user.id, email: user.email, name: user.name };
    }

    // LOGIN
    static async login(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            const err: any = new Error("This email is not registered. Please sign up first.");
            err.status = 404;
            throw err;
        }

        const valid = await comparePassword(password, user.password);
        if (!valid) {
            const err: any = new Error("Invalid password");
            err.status = 401;
            throw err;
        }

        const accessToken = signAccessToken({ userId: user.id, email: user.email });
        const refreshToken = signRefreshToken({ userId: user.id });

        const decoded = verifyRefreshToken(refreshToken);
        const expiresAt = new Date(decoded.exp * 1000);

        // Store hashed refresh token in DB
        await prisma.refreshToken.create({
            data: {
                tokenHash: hashToken(refreshToken),
                expiresAt,
                userId: user.id,
            },
        });

        return {
            accessToken,
            refreshToken,
            user: { id: user.id, email: user.email, name: user.name }
        };
    }

    // ROTATE REFRESH TOKEN
    static async rotateRefreshToken(oldToken: string) {
        const hashedOld = hashToken(oldToken);

        const dbToken = await prisma.refreshToken.findUnique({
            where: { tokenHash: hashedOld }
        });

        if (!dbToken || dbToken.revoked || dbToken.expiresAt < new Date()) {
            const err: any = new Error("Refresh token invalid or expired");
            err.status = 401;
            throw err;
        }

        // Revoke old refresh token
        await prisma.refreshToken.update({
            where: { id: dbToken.id },
            data: { revoked: true }
        });

        // Issue new refresh token
        const refreshToken = signRefreshToken({ userId: dbToken.userId });
        const decoded = verifyRefreshToken(refreshToken);

        await prisma.refreshToken.create({
            data: {
                tokenHash: hashToken(refreshToken),
                expiresAt: new Date(decoded.exp * 1000),
                userId: dbToken.userId
            },
        });

        // Generate new access token with email included
        const user = await prisma.user.findUnique({
            where: { id: dbToken.userId },
            select: { id: true, email: true, name: true },
        });

        if (!user) {
            const err: any = new Error("User not found");
            err.status = 404;
            throw err;
        }

        const accessToken = signAccessToken({ userId: user.id, email: user.email });

        return { accessToken, refreshToken, user };
    }

    // REVOKE REFRESH TOKEN
    static async revokeRefreshToken(token: string) {
        const hashed = hashToken(token);
        await prisma.refreshToken.updateMany({
            where: { tokenHash: hashed },
            data: { revoked: true }
        });
    }
}