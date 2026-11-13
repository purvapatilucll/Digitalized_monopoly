import { Card as CardPrisma, User as UserPrisma } from "@prisma/client";
import { User } from "./user";
export class Card {
  private id?: number;
  private message: string;
  private outcome: number;
  private type: string;
  private played: boolean;
  private store: boolean;

  constructor(card: {
    id?: number;
    message: string;
    outcome: number;
    type: string;
    played: boolean;
    store?: boolean;
  }) {
    this.validate(card);
    this.id = card.id;
    this.message = card.message;
    this.outcome = card.outcome;
    this.type = card.type;
    this.played = card.played;
    this.store = card.store || false;
  }

  private validate(card: {
    id?: number;
    message: string;
    outcome: number;
    type: string;
    played: boolean;
  }) {
    if (!card.message) {
      throw new Error("Message is required");
    }

    if (!card.type) {
      throw new Error("Type is required");
    }
  }

  getId(): number | undefined {
    return this.id;
  }

  getMessage(): string {
    return this.message;
  }

  getOutcome(): number {
    return this.outcome;
  }

  getType(): string {
    return this.type;
  }

  getPlayed(): boolean {
    return this.played;
  }

  getStore(): boolean {
    return this.store;
  }

  setStore(store: boolean): void {
    this.store = store;
  }

  setId(id: number): void {
    this.id = id;
  }
  setMessage(message: string): void {
    this.message = message;
  }
  setOutcome(outcome: number): void {
    this.outcome = outcome;
  }
  setType(type: string): void {
    this.type = type;
  }

  setPlayed(value: boolean): void {
    this.played = value;
  }

  static from({ id, message, outcome, type, played, store }: CardPrisma) {
    return new Card({
      id,
      message,
      outcome,
      type,
      played,
      store,
    });
  }
}
