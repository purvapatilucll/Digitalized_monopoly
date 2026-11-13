import { Steal } from "../model/steal";
import stealRepository from "../repository/steal.db";
import stealTokenRepository from "../repository/stealToken.db";
import { StealInputWithoutToken, StealInputWithToken } from "../types";
import transactionService from "./transactionService";
import userService from "./userService";
import { wss } from "../src/app";
import { v4 as uuidv4 } from 'uuid';
import { StealToken } from "../model/stealToken";

const getAllSteals = async (): Promise<Steal[]> => { return await stealRepository.getAllSteals(); }

const getStealTokenById = async (id: string): Promise<StealToken | null> => {
    const stealToken = await stealTokenRepository.getStealTokenById(id);
    if (!stealToken) {
        throw new Error("Steal token not found");
    }
    return new StealToken({
        id: stealToken.getId(),
        createdAt: stealToken.getCreatedAt(),
        expiresAt: stealToken.getExpiresAt(),
    });
}


/**
 * 
 * @description Create a new steal
 * 
 * @param stealerPiece
 * @param victimPiece
 * @param amount
 * @param stealersIp
 * @param timeStamp
 * @param token 
 * 
 * @returns {Steal Object or number}
 */
const createSteal = async ({
    stealerPiece,
    victimPiece,
    amount,
    stealersIp = "",
    timeStamp = new Date(),
    token,
}: Partial<StealInputWithToken> & StealInputWithoutToken): Promise<Steal | number> => {
    
    validateBasicStealInput(stealerPiece, victimPiece, amount);

    // If token is provided, validate it
    // -> Because this is for the QR code, so we need to validate the token
    if (token) {
        // Token and rate limiting validation
        const stealToken = await stealTokenRepository.getStealTokenById(token);
        if (!stealToken || stealToken.getExpiresAt() < new Date()) {
            throw new Error("Invalid or expired steal token");
        }

        if (!stealersIp) throw new Error("Stealers IP is required with token");

        const recentSteal = await stealRepository.validateSteal(stealersIp, stealerPiece);
        const fiveMinutesInMillis = 2 * 60 * 1000;

        if (recentSteal) {
            const timeDifference = new Date().getTime() - new Date(recentSteal.getTimeStamp()).getTime();
            if (timeDifference < fiveMinutesInMillis) return 201;
        }
    }

    // If no token is provided or token is validated, validate the users
    // -> This is for the basic steal after the token is validated or when no token is provided
    const { receiver, sender } = await validateUsersExist(stealerPiece, victimPiece);
    await executeTransaction(receiver, sender, amount);
    await broadcastBalanceChange();

    const steal = new Steal({
        stealerPiece,
        stealersIp,
        victimPiece,
        amount,
        timeStamp,
    });

      
    receiver.addRobbed(steal);
    sender.addSteal(steal);

    return await stealRepository.createSteal(steal);

}

const createStealToken = async (): Promise<StealToken> => {
    // const lastStealToken = await stealTokenRepository.getStealToken();
    // if (lastStealToken)
    //     if (lastStealToken && lastStealToken.getExpiresAt() > new Date())
    //         throw new Error("There is already a steal token alive");

    // create a new token
    const experationTime = new Date(Date.now() + 2 * 60 * 1000);
    const token = uuidv4();

    const stealToken = await stealTokenRepository.createStealToken(token, experationTime);
    if (!stealToken)
        throw new Error("Failed to create steal token");

    const newStealToken = new StealToken({
        id: stealToken.getId(),
        createdAt: stealToken.getCreatedAt(),
        expiresAt: stealToken.getExpiresAt(),
    });

    return newStealToken;
}

/**
 * 
 * @description Helper Function: To validate the input for a basic steal without a token and ip
 * 
 * @param stealerPiece 
 * @param victimPiece 
 * @param amount 
 */
const validateBasicStealInput = (stealerPiece: string, victimPiece: string, amount: number) => {
    if (!stealerPiece || !victimPiece || amount < 0) {
        throw new Error("Steal information is required");
    }
    if (stealerPiece === victimPiece) {
        throw new Error("Stealer and victim pieces cannot be the same");
    }
};

/**
 * 
 * @description Helper Function: To validate if the users exist
 * @
 * 
 * @param stealerPiece 
 * @param victimPiece 
 * @param amount 
 */ 
const validateUsersExist = async (stealerPiece: string, victimPiece: string) => {
    const receiver = await userService.getUserByPiece(stealerPiece);
    const sender = await userService.getUserByPiece(victimPiece);

    if (!receiver || !sender) {
        throw new Error("Invalid user pieces.");
    }

    return { receiver, sender };
};

/**
 * 
 * @description Helper Function: To execute the transaction
 * 
 * @param receiver 
 * @param sender 
 * @param amount 
 */
const executeTransaction = async (receiver: any, sender: any, amount: number) => {
    const senderCardName = sender.getCardName();
    const receiverCardName = receiver.getCardName();

    await transactionService.createTransaction({ senderCardName, receiverCardName, amount });
};

/**
 * 
 * @description Helper Function: To send the scan result to all connected WebSocket clients
 * 
 */
const broadcastBalanceChange = async () => {
    const users = await userService.getAllUsers();

    wss.clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(JSON.stringify({ event: "balanceChanged", data: users }));
        }
    });
};


export default {
    createSteal,
    getAllSteals,
    createStealToken,
    getStealTokenById,
};
