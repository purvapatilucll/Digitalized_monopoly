import type { User as UserPrisma, Card as CardPrisma, Steal as StealPrisma } from "@prisma/client";

import { Card } from "./card";
import { Steal } from "./steal";
export class User {
  private id?: number;
  private cardName: string;
  private piece: string;
  private balance: number;
  private balanceHistory: number[];
  private role: string;
  private cards: Card[];
  private stolen: Steal[] = [];
  private robbed: Steal[] = [];
  private ddossed: number;
  private protected: number;


  constructor(user: {
    id?: number;
    cardName: string;
    piece: string;
    balance: number;
    balanceHistory: number[];
    role: string;
    cards: Card[];
    stolen: Steal[];
    robbed: Steal[];
    ddossed: number;
    protected: number;

  }) {
    this.validate(user);
    this.id = user.id;
    this.cardName = user.cardName;
    this.piece = user.piece;
    this.balance = user.balance;
    this.balanceHistory = user.balanceHistory;
    this.role = user.role;
    this.cards = user.cards;
    this.stolen = user.stolen;
    this.robbed = user.robbed;
    this.ddossed = user.ddossed;
    this.protected = user.protected;
  }

  private validate(user: {
    id?: number;
    cardName: string;
    piece: string;
    balance: number;
    balanceHistory: number[];
    role: string;
  }) {
    if (!user.cardName) {
      throw new Error("Card Name is required");
    }
    if (!user.piece) {
      throw new Error("Piece is required");
    }
    if (!user.role) {
      throw new Error("Role is required");
    }
  }

  getId(): number | undefined {
    return this.id;
  }

  getCardName(): string {
    return this.cardName;
  }

  getPiece(): string {
    return this.piece;
  }
  getBalance(): number {
    return this.balance;
  }
  getBalanceHistory(): number[] {
    return this.balanceHistory;
  }

  getRole(): string {
    return this.role;
  }

  getCards(): Card[] {
    return this.cards;
  }

  getStolen(): Steal[] {
    return this.stolen;
  }
  getRobbed(): Steal[] {
    return this.robbed;
  }

  setCards(cards: Card[]): void {
    this.cards = cards;
  }

  setId(id: number): void {
    this.id = id;
  }

  setCardName(cardName: string) {
    this.cardName = cardName;
  }

  setPiece(piece: string): void {
    this.piece = piece;
  }
  setBalance(balance: number): void {
    this.balance = balance;
  }

  setBalanceHistory(history: number[]): void {
    this.balanceHistory = history;
  }

  setRole(role: string): void {
    this.role = role;
  }

  // Implements Steal or Robbed interface
  addSteal(steal: Steal): void {
    this.stolen.push(steal);
  }

  addRobbed(steal: Steal): void {
    this.robbed.push(steal);
  }

  addBalance(balance: number): void {
    if (balance < 0 && this.balance < balance) {
      throw new Error("Not enough balance.");
    }

    this.balanceHistory.push(this.balance);
    this.balance += balance;
  }

  static from({
    id,
    cardName,
    piece,
    balance,
    balanceHistory,
    role,
    cards,
    stolen,
    robbed,
    Ddossed,
    Protected
  }: UserPrisma & {
    cards: CardPrisma[];
    stolen: StealPrisma[];
    robbed: StealPrisma[];
  }) {
    return new User({
      id,
      cardName,
      piece,
      balance,
      balanceHistory,
      role,
      cards: cards.map((card) => Card.from(card)),
      stolen: stolen.map((steal) => Steal.from(steal)),
      robbed: robbed.map((steal) => Steal.from(steal)),
      ddossed: Ddossed,
      protected: Protected
    });
  }
}
