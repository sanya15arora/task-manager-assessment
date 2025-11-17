import app from "./app";
import { ENV } from "./config/env";
import { prisma } from "./prisma/client";

const PORT = Number(ENV.PORT) || 5000;

async function start() {
    try {
        await prisma.$connect();
        app.listen(PORT, () => {
            console.log(`Server listening on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server", err);
        process.exit(1);
    }
}

start();
