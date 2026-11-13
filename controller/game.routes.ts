import express, { Request, Response } from "express";
import gameService from "../service/gameService";
import { wss } from "../src/app";
import database from "../repository/database";

const gameRouter = express.Router();

gameRouter.post("/reset", async (req: Request, res: Response) => {
  try {
    const message = await gameService.resetGame();
    res.status(200).json({ message });
  } catch (error) {
    console.error("Error resetting game:", error);
    res.status(500).json({ error: "Failed to reset game." });
  }
});


gameRouter.patch("/end", async (req: Request, res: Response) => {
  try {
    const result = await gameService.checkToEndGame();

    if (!result) {
      res.status(202).json({
        message: "Game has not yet ended"
      })
    } else {
      res.status(200).json({
        message: "Game ended successfully",
        game: result.game,
        winner: result.winner,
      });
    }
  } catch (error) {
    console.error("Error ending the game:", error);
    res.status(500).json({ error: "Failed to end the game." });
  }
});

gameRouter.post("/startNew/:winStrat", async (req: Request, res: Response) => {
  try {
    const winStrat = req.params.winStrat;
    const result = await gameService.createGame(winStrat);

    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: "gameCreated", data: {} }));
      }
    });

    res.status(200).json(result)
  } catch(error) {
    console.error("error when ending the game:", error);
    res.status(500).json({error: "failed to create game"})
  }
})



export { gameRouter };