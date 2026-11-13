import cardService from "../service/cardService";
import userService from "../service/userService";
import express, { NextFunction, Request, Response } from "express";

const cardRouter = express.Router();
// Test

cardRouter.get("/", async (req, res) => {
  try {
    const cards = await cardService.getAllCards();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cards." });
    console.log(error);
  }
});

cardRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const card = await cardService.getCardById(Number(req.params.id));
      console.log(card);
      res.status(200).json(card);
    } catch (error) {
      next(error);
    }
  }
);

cardRouter.get(
  "/type/:type",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cards = await cardService.getCardsByType(String(req.params.type));
      res.status(200).json(cards);
    } catch (error) {
      next(error);
    }
  }
);

cardRouter.post("/reset", async (req, res) => {
  try {
    await cardService.resetAllCards();
    res.status(200).json({ message: "All cards have been reset." });
  } catch (error) {
    console.error("Error resetting cards:", error);
    res.status(500).json({ error: "Failed to reset cards." });
  }
});

cardRouter.get("/played/all", async (req, res) => {
  try {
    const playedCards = await cardService.getPlayedCards();
    res.status(200).json(playedCards);
  } catch (error) {
    console.error("Error fetching played cards:", error);
    res.status(500).json({ error: "Failed to fetch played cards." });
  }
});

cardRouter.get(
  "/user/:cardName/chance",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cardName = req.params.cardName;
      const user = await userService.getUserByCardName(cardName);

      const chanceCards = await cardService.getChanceCardsByUser(user);
      res.status(200).json(chanceCards);
    } catch (error) {
      next(error);
    }
  }
);


cardRouter.get(
  "/user/:cardName/chest",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cardName = req.params.cardName;
      const user = await userService.getUserByCardName(cardName);

      const chestCards = await cardService.getChestCardsByUser(user);
      res.status(200).json(chestCards);
    } catch (error) {
      next(error);
    }
  }
);

export { cardRouter };
