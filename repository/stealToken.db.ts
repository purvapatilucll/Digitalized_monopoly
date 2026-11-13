import { StealToken } from "../model/stealToken";
import database from "./database";

const createStealToken = async (token: string, expiresAt: Date) => {
    try {
        const stealToken = await database.stealToken.create({
            data: {
                id: token,
                createdAt: new Date(),
                expiresAt,
            },
        });

        return StealToken.from(stealToken);
    } catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
}

const getStealToken = async () => {
    try {
        const stealToken = await database.stealToken.findFirst({
            where: {
                expiresAt: {
                    gte: new Date(),
                },
            },
        });

        return stealToken ? StealToken.from(stealToken) : null;
    } catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
};

const getStealTokenById = async (id: string) => {
    try {
        const stealToken = await database.stealToken.findUnique({
            where: {
                id,
            },
        });

        return stealToken ? StealToken.from(stealToken) : null;
    } catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
}

export default {
    createStealToken,
    getStealToken,
    getStealTokenById,
};
