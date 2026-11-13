import userService from "./userService";
import transactionService from "./transactionService";
import scanService from "./scanService";
import cardService from "./cardService";
import gameDb from "../repository/game.db";
import { PrismaClient, Game as PrismaGame, User as UserPrisma } from "@prisma/client";
import { Game } from "../model/game";
import { User } from "../model/user";

const prisma = new PrismaClient();

const resetGame = async (): Promise<string> => {
  try {
    await transactionService.deleteAllTransactions();
    await scanService.deleteAllScans();
    await userService.deleteAllUsers();
    await cardService.resetAllCards();

    return "Game has been reset successfully.";
  } catch (error) {
    console.error("Game reset failed: ", error);
    throw new Error("Failed to reset game.");
  }
};

const checkToEndGame = async (): Promise<{ game: Game; winner: User } | null> => {
  const activeGame = await prisma.game.findFirst({
    where: { isOver: false },
  });
  if (!activeGame) {
    throw new Error("No active game found");
  }
  const users: User[] = (await userService.getAllUsers()).filter(user => user.getCardName() != "bank");


  switch(activeGame.winStrat) {
    case "first_out": {
		//FIRST OUT: THE GAME ENDS WHEN ONE PLAYER IS BANKRUPT
		const bankruptUser = users.find(user => user.getBalance() <= 0);
		if (!bankruptUser) return null;

		const winner: User = users.reduce((prev, curr) =>
			curr.getBalance() > prev.getBalance() ? curr : prev
		);

		const game = await gameDb.endGame()

		return {game,winner}

    } case "highlander" : {
		//HIGHLANDER: THE GAME ENDS WHEN ONLY ONE PLAYER REMAINS

		const survivors = users.filter(user => user.getBalance() > 0);

		if (survivors.length != 1) {
			return null;
		}

		if (survivors.length == 1) {
			const winner = survivors[0];
			const game = await gameDb.endGame();

			return {
				game,
				winner
			}
		}

		throw new Error("no survivors left")

    } case "billionaire": {
		//MULTIMILIONAIR: FIRST TO 100 MILLION MONEY WINS
		const multimilionair = users.find(user => user.getBalance() >= 100000000);

		if (!multimilionair) {
			return null;
		}

		const winner = multimilionair;
		const game = await gameDb.endGame();

		return {game, winner}

	} case "timeISmoney": {
		//TIME IS MONEY: THE GAME ENDS AFTER 45 MINUTES OF PLAY TIME
		
		if ( (Date.now() - activeGame.startedAt.getTime()) / (1000 * 60)  > 45 ) {
			const winner: User = users.reduce((prev, curr) =>
				curr.getBalance() > prev.getBalance() ? curr : prev
			);
	
			const game = await gameDb.endGame()
	
			return {game,winner}				
		} else {
			return null;
		}
	} case "blitz": {
		//TIME IS MONEY: THE GAME ENDS AFTER 15 MINUTES OF PLAY TIME
		
		if ( (Date.now() - activeGame.startedAt.getTime()) / (1000 * 60)  > 15 ) {
			const winner: User = users.reduce((prev, curr) =>
				curr.getBalance() > prev.getBalance() ? curr : prev
			);
	
			const game = await gameDb.endGame()
	
			return {game,winner}				
		} else {
			return null;
		}
	} case "ultra_blitz": {
		//TIME IS MONEY: THE GAME ENDS AFTER 7 MINUTES OF PLAY TIME
		
		if ( (Date.now() - activeGame.startedAt.getTime()) / (1000 * 60)  > 7 ) {
			const winner: User = users.reduce((prev, curr) =>
				curr.getBalance() > prev.getBalance() ? curr : prev
			);
	
			const game = await gameDb.endGame()
	
			return {game,winner}				
		} else {
			return null;
		}
	} default: {
      throw new Error("problem with the game ending strategy");
    }
  }
};

const activeGameExists = async (): Promise<boolean> => {
  const activeGame = await prisma.game.findFirst({
    where: { isOver: false },
  });
  return (activeGame != null)
}

const createGame = async (winStrat: string): Promise<Game> => {
  if (await activeGameExists()) {
    await gameDb.endGame()
  }

  await resetGame();

  const createdGame = await gameDb.createGame(winStrat);
  if(!createGame) {
    throw new Error("failed to create game")
  }

  await userService.createUser(new User({cardName: "bank", piece:"bank", balance: 777, balanceHistory: [], role: "bank", cards: [], stolen: [], robbed: [] , ddossed: 0, protected: 0}))

  return createdGame;
} 

export default {
  resetGame,
  checkToEndGame,
  createGame,
  activeGameExists,
};
