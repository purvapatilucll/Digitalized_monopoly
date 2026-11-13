import express, { NextFunction, Request, Response } from "express";
import transactionService from "../service/transactionService";
import { wss } from "../src/app";
import userService from "../service/userService";
import gameService from "../service/gameService";
import userDb from "../repository/user.db";

const transactionRouter = express.Router();

transactionRouter.get("/", async (req, res) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions." });
    console.log(error);
  }
});

transactionRouter.post("/create/:senderCardName/:receiverCardName/:amount", async (req, res) => {
  try {

    const senderCardName = req.params.senderCardName
    const receiverCardName = req.params.receiverCardName
    const amount = parseInt(req.params.amount)

    const transaction = await transactionService.createTransaction({senderCardName, receiverCardName, amount});

    const users = await userService.getAllUsers();
    const sender = await userService.getUserByCardName(senderCardName)
    const receiver = await userService.getUserByCardName(receiverCardName)
    const transactionMessage = `${sender?.getPiece()} payed ${receiver?.getPiece()} \n ${amount}`
        wss.clients.forEach(client => {
          if (client.readyState === 1) {
            client.send(JSON.stringify({ event: "transactionHappened", data: 
              {
                sender: sender?.getPiece(),
                receiver: receiver?.getPiece(),
                amount
              }
             }));
          }
        });

    const gameEnd = await gameService.checkToEndGame();
    console.log("GAME END?: " + gameEnd);
    if (gameEnd) {
      wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({
          event: "gameEnded",
          data: {
            message: "Game ended successfully",
            game: gameEnd.game, // game object
            winner: gameEnd.winner, // user object
          } }));
        }
      });
    }


    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: "Failed to make transaction" });
    console.log(error);
  }
});

transactionRouter.post("/roulette/:gambler/:amount", async (req, res) => {
  try {
    const gambler = req.params.gambler;
    const amount = parseInt(req.params.amount);

    const transaction = await transactionService.createRouletteTransaction(gambler, amount);

    const users = await userService.getAllUsers();
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: "balanceChanged", data: users }));
      }
    });

    res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to make transaction" });
  }
}
);
  

transactionRouter.delete('/:id', async (req, res) =>{
    try{
        const id = parseInt(req.params.id);
        const message = await transactionService.deleteAllTransactions();

        res.status(200).json(message);
    }catch(error){
        console.error(error);
        res.status(400).json({error: "Failed to delete transaction"});
    }
});


transactionRouter.post("/scanCard/:senderCardName/:cardType", async (req, res) => {
  try {
    const senderCardName = req.params.senderCardName;
    const cardType = req.params.cardType;
    const scanResult = await transactionService.scanCardAndChangeBalance(senderCardName, cardType)

    // Send the scan result to all connected WebSocket clients
    const users = await userService.getAllUsers();
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: "cardScanned", data: scanResult }));
        client.send(JSON.stringify({ event: "balanceChanged", data: users }));
      }
    });

    res.status(200).json(scanResult)
  } catch (error) {
    console.error(error);
    console.log(error)
    res.status(500).json({ error: 'Failed to apply card effect' });
  }
});

transactionRouter.delete('/all', async (req: Request, res: Response) => {
  try {
    const message = await transactionService.deleteAllTransactions();
    res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete all transactions." });
  }
});

transactionRouter.post("/start/:receiverCardName", async (req, res) => {
  try{
    const receiverCardName = req.params.receiverCardName
    
    const transaction = userService.goPastStart(receiverCardName)
    const users = await userService.getAllUsers();
      wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({ event: "balanceChanged", data: users }));
          client.send(JSON.stringify({ event: "goPastStart" }));
        }
      });
    res.status(200).json(transaction);

  } catch (error) {
    res.status(400).json({ error: "Failed to make transaction" });
    console.log(error);
  }
})

export { transactionRouter };