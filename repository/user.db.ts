import { Card } from "@prisma/client";
import { User } from "../model/user";
import { UserInput } from "../types";
import database from "./database";

const getAllUsers = async (): Promise<User[]> => {
  try {
    const userPrisma = await database.user.findMany({
      include: { 
        cards: true,
        stolen: true,
        robbed: true,
      },
    });
    return userPrisma.map((userPrisma) => User.from(userPrisma));
  } catch (error) {
    console.error(error);
    throw new Error("Database error. See server log for details.");
  }
};

const getUserById = async (id: number): Promise<User | null> => {
  try {
    const userPrisma = await database.user.findUnique({
      where: { id },
      include: { 
        cards: true,
        stolen: true,
        robbed: true,
      },
    });

    return userPrisma ? User.from(userPrisma) : null;
  } catch (error) {
    console.error(error);
    throw new Error("Database error. See server log for details.");
  }
};

const getUserByPiece = async (piece: string): Promise<User | null> => {
  try {
    const userPrisma = await database.user.findUnique({
      where: { piece },
      include: { 
        cards: true,
        stolen: true,
        robbed: true,
      },
    });

    return userPrisma ? User.from(userPrisma) : null;
  } catch (error) {
    console.error(error);
    throw new Error("Database error. See server log for details.");
  }
};

const getUserByCardName = async (cardName: string): Promise<User | null> => {
  try {
    const userPrisma = await database.user.findUnique({
      where: { cardName },
      include: { 
        cards: true,
        stolen: true,
        robbed: true,
      },
    });

    return userPrisma ? User.from(userPrisma) : null;
  } catch (error) {
    console.error(error);
    throw new Error("Database error. See server log for details.");
  }
};

const createUser = async (user: User): Promise<User> => {
  try {
    const userPrisma = await database.user.create({
      data: {
        cardName: user.getCardName(),
        piece: user.getPiece(),
        balance: user.getBalance(),
        balanceHistory: user.getBalanceHistory(),
        role: user.getRole(),
        cards: {
          connect: user.getCards().map((card) => ({ id: card.getId() })),
        },
      },
      include: { 
        cards: true,
        stolen: true,
        robbed: true,
      },
    });

    return User.from(userPrisma);
  } catch (error) {
    console.error(error);
    throw new Error("Database error. See server log for details.");
  }
};

const deleteUser = async ({ id }: { id: number }): Promise<string> => {
  try {
    // Finds the user
    const user = await database.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error("User not found");
    }

    const piece = user.piece;
    const cardName = user.cardName;

    await database.$transaction([
      // Deletes all scans for user
      database.scan.deleteMany({ where: { userCardName: cardName } }),
      // Deletes all transactions where user is sender or receiver
      database.transaction.deleteMany({ where: { senderPiece: piece } }),
      database.transaction.deleteMany({ where: { receiverPiece: piece } }),
      // Deletes the user
      database.user.delete({ where: { id } }),
    ]);

    return "The user has been deleted successfully from the database.";
  } catch (error) {
    console.error(error);
    throw new Error("Database error. See server log for details.");
  }
};

const updateUser = async (
  id: number,
  updatedData: UserInput
): Promise<User | null> => {
  try {
    const updatedUser = await database.user.update({
      where: { id },
      data: {
        ...(updatedData.cardName && { cardName: updatedData.cardName }),
        ...(updatedData.piece && { piece: updatedData.piece }),
        ...(updatedData.balance && { balance: updatedData.balance }),
        ...(updatedData.balanceHistory && {
          balanceHistory: updatedData.balanceHistory,
        }),
        ...(updatedData.role && { role: updatedData.role }),
      },
      include: {
        transactionsSent: true,
        transactionsReceived: true,
        scans: true,
        cards: true,
        stolen: true,
        robbed: true,
      },
    });
    return updatedUser ? User.from(updatedUser) : null;
  } catch (error) {
    console.error(error);
    throw new Error(
      "Failed to update user. Please check the server log for more details."
    );
  }
};

const deleteAllUsers = async (): Promise<void> => {
  await database.steal.deleteMany();
  await database.scan.deleteMany();
  await database.transaction.deleteMany();
  await database.user.deleteMany();
};

const ddosUser = async (piece: string): Promise<User | null> => {
  try {
  const Duser = await database.user.update({
    where: { piece },
    data: { Ddossed: 2 },
    include: { 
      cards: true,
      stolen: true,
      robbed: true,
    },
  });
  return User.from(Duser);
  }catch(error){
    console.error(error);
    throw new Error(
      "Failed to activate DDOS"
    );
  }
}

const decrementDdos = async (cardName: string): Promise<User | null> => {
  const returnUser = await database.user.update({
    where: {cardName},
    include: { 
      cards: true,
      stolen: true,
      robbed: true,
    },
    data: {
      Ddossed: {increment: -1},
    }
  })

  return User.from(returnUser)
}

const protectUser = async (cardName: string): Promise<User | null> => {
  try {
    const protectedUser = await database.user.update({
      where: { cardName },
      data: { Protected: 2 },
      include: { 
        cards: true,
        stolen: true,
        robbed: true,
      },
  });
  return User.from(protectedUser);
  }catch(error){
    console.error(error);
    throw new Error(
      "Failed to protect User"
    );
  }
}

const decrementProtect = async (cardName: string): Promise<User | null> => {
  const returnUser = await database.user.update({
    where: {cardName},
    include: { 
      cards: true,
      stolen: true,
      robbed: true,
    },
    data: {
      Protected: {increment: -1},
    }
  })

  return User.from(returnUser)
}

const getProtectedStatusByCardName = async (cardName: string): Promise<number> => {
  const user = await database.user.findUnique({
    where: { cardName },
    select: { Protected: true },
  });
  if (!user) throw new Error("User not found");
  return user.Protected;
};

const getDdossedStatusByCardName = async (cardName: string): Promise<number> => {
  const user = await database.user.findUnique({
    where: { cardName },
    select: { Ddossed: true },
  });
  if (!user) throw new Error("User not found");
  return user.Ddossed;
};

const addDrawnCardToUser = async(cardName: string, cardId: number): Promise<Card[] | null> => {
    const user = await database.user.findUnique({
    where: { cardName },
    select: { cards: true },
  });

  if(!user){
    return null
  }

  const newUser = await database.user.update({
    where: { cardName },
    data: {
      cards: {
        connect: { id: cardId }, // assuming card is already created and has an id
      },
    },
    select: {
      cards: true,
    },
  });

  return user.cards
}

const getDrawnCardsByUser = async(cardName: string): Promise<Card[] | null> => {
  const user = await database.user.findUnique({
    where: {cardName},
    include: {cards: true}
  })
  return user ? user.cards : null;

}

export default {
  getAllUsers,
  getUserById,
  getUserByPiece,
  getUserByCardName,
  createUser,
  deleteUser,
  updateUser,
  deleteAllUsers,
  ddosUser,
  getDdossedStatusByCardName,
  getProtectedStatusByCardName,
  getDrawnCardsByUser,
  protectUser,
  decrementDdos,
  decrementProtect,
  addDrawnCardToUser
};
