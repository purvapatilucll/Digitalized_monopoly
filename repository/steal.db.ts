import { Steal } from "../model/steal";
import database from "./database";

const createSteal = async (stealInfo: Steal): Promise<Steal> => {
    try {
        const stealPrisma = await database.steal.create({
            data: {
                stealerPiece: stealInfo.getStealerPiece(),
                stealersIp: stealInfo.getStealersIp(),
                victimPiece: stealInfo.getVictimPiece(),
                amount: stealInfo.getAmount(),
                timeStamp: stealInfo.getTimeStamp(),
            },
        });

        return Steal.from(stealPrisma);
    } catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
};

const validateSteal = async(stealersIp: string, stealerPiece: string): Promise<Steal | null> => {
    try {
        const recentSteal = await database.steal.findFirst({
        where: {
            OR: [
            { stealersIp },
            { stealerPiece }
            ]
        },
        orderBy: {
            timeStamp: 'desc',
        },
        });

        if (!recentSteal) {
            return null;
        }
        return Steal.from(recentSteal);
    } catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
};

const getAllSteals = async (): Promise<Steal[]> => {
    try {
        const steals = await database.steal.findMany();
        return steals.map(steal => Steal.from(steal));
    } catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
}

export default {
    createSteal,
    validateSteal,
    getAllSteals,
};