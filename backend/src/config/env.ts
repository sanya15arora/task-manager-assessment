import dotenv from "dotenv";

dotenv.config();

export const ENV = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || "development",
    DATABASE_URL: process.env.DATABASE_URL || "",
    FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || "http://localhost:3000",

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "access_secret",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "refresh_secret",
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || "3s",
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "2m",
};
