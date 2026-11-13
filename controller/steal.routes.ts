import express, { NextFunction, Request, Response } from "express";
import stealService from "../service/stealService";

const stealRouter = express.Router();

/**
 * @description Get all steals
 * @route GET /steals
 * 
 * @returns {Steal[]}
 */
stealRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const steals = await stealService.getAllSteals();
        res.status(200).json(steals);
    } catch (error) {
        next(error);
    }
});

/**
 * @description Create a new basic steal
 * @route POST /steals/steal/:stealerPiece/:victimPiece
 * 
 * @param {string} stealerPiece - The id of the stealer piece
 * @param {string} victimPiece - The id of the victim piece
 * @param {number} amount - The amount of the steal
 * @returns {Steal}
 */
stealRouter.post("/steal/:stealerPiece/:victimPiece", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { stealerPiece, victimPiece } = req.params;
        const { amount } = req.body;
        const steal = await stealService.createSteal({ stealerPiece, victimPiece, amount, timeStamp: new Date() });
        res.status(200).json(steal);
    } catch (error) {
        next(error);
    }

})

/**
 * @description Create a new steal with qr code
 * @route POST /steals/QR/steal/:stealerPiece/:victimPiece
 * 
 * @param {string} stealerPiece - The id of the stealer piece
 * @param {string} victimPiece - The id of the victim piece
 * @param {number} amount - The amount of the steal
 * @param {string} stealersIp - The ip of the stealer
 * @param {string} token - The token of the qr code
 * @returns {Steal}
 */
stealRouter.post("/QR/steal/:stealerPiece/:victimPiece", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { stealerPiece, victimPiece } = req.params;
        const { amount, stealersIp, token } = req.body;

        let statusCode = 200;
        let data = null;

        // Call the service to create the steal
        data = await stealService.createSteal({ stealerPiece, stealersIp, victimPiece, amount, timeStamp: new Date(), token});

        if (data === 201) {
            statusCode = 201;
            data = { message: "Ya cheater! You have to scan the qr code again!" };
        }

        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
});


/**
 * @description Create a new steal token
 * @route Get /steals/token
 * 
 * @returns {StealToken}
 */
stealRouter.get("/create/token", async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("Creating a new steal token");
        const stealToken = await stealService.createStealToken();
        res.status(200).json(stealToken);
    } catch (error) {
        next(error);
    }
});

/**
 * @description Get a steal token by id
 * @route GET /steals/token/:id
 * 
 * @param {string} id - The id of the steal
 * @returns {Steal}
 */
stealRouter.get("/token/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const steal = await stealService.getStealTokenById(id);
        res.status(200).json(steal);
    } catch (error) {
        next(error);
    }
});


export { stealRouter };