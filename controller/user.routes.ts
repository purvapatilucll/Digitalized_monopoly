import express, { NextFunction, Request, Response } from "express";
import userService from "../service/userService";
import { User } from "../model/user";
import { UserInput } from "../types/index";
import { wss } from "../src/app";

const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users." });
    console.log(error);
  }
});

userRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.getUserById(Number(req.params.id));
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.get(
  "/piece/:piece",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.getUserByPiece(String(req.params.piece));
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.get(
  "/cardName/:cardName",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.getUserByCardName(
        String(req.params.cardName)
      );
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.post(
  "/create/:userPiece/:cardName",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Define the UserInput type
      const { userPiece, cardName } = req.params;

      const newUser = new User({
        cardName: cardName,
        piece: userPiece,
        balance: 15000000,
        balanceHistory: [15000000],
        role: "player",
        cards: [],
        stolen: [],
        robbed: [],
        ddossed: 0,
        protected: 0 
      });
      const createdUser = await userService.createUser(newUser);

      const users = await userService.getAllUsers();
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({ event: "userCreated", data: users }));
        }
      });

      res.status(200).json(createdUser);
    } catch (error) {
      res.status(500).json("failed to create user");
      next(error);
    }
  }
);

userRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    const message = await userService.deleteUser(id);

    res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: "error" });
  }
});

userRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updatedData: UserInput = req.body;

    const updatedUser = await userService.updateUser(id, updatedData);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: "error" });
  }
});

userRouter.put("/delete/all", async (req: Request, res: Response) => {
  try {
    const message = await userService.deleteAllUsers();
    res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});


userRouter.post("/drawnCards/:cardName/:cardId", async (req, res) => {
  try{
    const cardName = req.params.cardName
    const cardId = parseInt(req.params.cardId)
    const addCard = await userService.addDrawnCardToUser(cardName, cardId)
    res.status(200).json(addCard)
  } catch(error){
    console.log(error)
    res.status(500).json(error)
  }
})

userRouter.get("/drawnCards/:cardName", async (req, res) => {
  try{
    const cardName = req.params.cardName
    const cardsOfUser = await userService.getDrawnCardsByUser(cardName)
    res.status(200).json({cardsOfUser})
  }catch (error){
    console.log(error)
    res.status(500).json({error})
  }
})

userRouter.post("/protect/:cardName", async(req, res) =>{
    try{
    const cardName = req.params.cardName
    const protectUser = await userService.protectUser(cardName)
    res.status(200).json({protectUser})
  }catch (error){
    console.log(error)
    res.status(500).json({error})
  }
})




userRouter.post("/ddos/:piece", async (req : Request, res : Response) => {
  try{
    const piece = req.params.piece
    const updatedUser = await userService.ddosUser(piece)
    res.status(200).json(updatedUser)
  } catch(error) {
    console.log(error)
    res.status(500).json({error})
  }
})

export { userRouter };
