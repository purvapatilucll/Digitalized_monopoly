import {
  Transaction as TransactionPrisma,
  User as UserPrisma,
  Card as CardPrisma,
  Steal as StealPrisma,
} from "@prisma/client";
import { User } from "./user";

export class Transaction {
  private id?: number;
  readonly timeStamp?: Date;
  private readonly sender: User;
  private readonly receiver: User;
  private readonly amount: number;
  private roulette?: boolean;

  constructor(transaction: {
    id?: number;
    timeStamp?: Date;
    sender: User;
    receiver: User;
    amount: number;
    roulette?: boolean;
  }) {
    this.validate(transaction);
    this.id = transaction.id;
    this.timeStamp = transaction.timeStamp;
    this.sender = transaction.sender;
    this.receiver = transaction.receiver;
    this.amount = transaction.amount;
    this.roulette = transaction.roulette;
  }

  private validate(transaction: {
    id?: number;
    timeStamp?: Date;
    sender: User;
    receiver: User;
    amount: number;
  }) {
    if (!transaction.sender) {
      throw new Error("Sender is required");
    }

    if (!transaction.receiver) {
      throw new Error("Receiver is required");
    }

    if (!transaction.amount) {
      throw new Error("Amount is required");
    }
  }

  getId(): number | undefined {
    return this.id;
  }

  getSender(): User {
    return this.sender;
  }

  getReceiver(): User {
    return this.receiver;
  }

  getAmount(): number {
    return this.amount;
  }

  getRoulette(): boolean | undefined {
    return this.roulette;
  }

  setId(id: number): void {
    this.id = id;
  }

  setRoulette(roulette: boolean): void {
    this.roulette = roulette;
  }

  static from({
    id,
    timeStamp,
    sender,
    receiver,
    amount,
    roulette
  }: TransactionPrisma & {
    sender: UserPrisma & { cards: CardPrisma[] } & { stolen: StealPrisma[] } & { robbed: StealPrisma[] };
    receiver: UserPrisma & { cards: CardPrisma[] } & { stolen: StealPrisma[] } & { robbed: StealPrisma[] };
  }) {
    return new Transaction({
      id,
      timeStamp,
      sender: User.from(sender),
      receiver: User.from(receiver),
      amount,
      roulette: roulette ?? false,
    });
  }
}
