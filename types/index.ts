import { Steal } from "@prisma/client";

export type UserInput = {
  id?: number;
  cardName: string;
  piece: string;
  balance: number;
  balanceHistory: number[];
  role: Role;
  cards: Card[];
  robbed: Steal;
  stolen: Steal;
};

export type TransactionInput = {
  id?: number;
  amount: number;
  senderCardName: string;
  receiverCardName: string;
};

export type Card = {
  id?: number;
  message: string;
  outcome: number;
  type: string;
  store: boolean;
  user?: UserInput;
};

export type ScanInput = {
  id?: number;
  userCardName: string;
  typeOfScan: string;
};

export type StealInputWithToken = {
  id?: number;
  stealerPiece: string;
  stealersIp: string;
  victimPiece: string;
  amount: number;
  timeStamp: Date;
  token: string;
};

export type StealInputWithoutToken = {
  id?: number;
  stealerPiece: string;
  victimPiece: string;
  amount: number;
  timeStamp: Date;
};

type Role = "player" | "bank";
