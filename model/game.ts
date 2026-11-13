import { Game as GamePrisma, User as UserPrisma, Scan as ScanPrisma } from "@prisma/client";
import { User } from "./user";
import { Scan } from "./scan";

export class Game {
  private id?: number;
  private isOver: boolean;
  private startedAt: Date;
  private endedAt?: Date;
  private winStrat: string;

  constructor(game: {
    id?: number;
    isOver: boolean;
    startedAt: Date;
    endedAt?: Date;
    winStrat: string;
  }) {
    this.validate(game);
    this.id = game.id;
    this.isOver = game.isOver;
    this.startedAt = game.startedAt;
    this.endedAt = game.endedAt;
    this.winStrat = game.winStrat;
  }

  private validate(game: {
    id?: number;
    isOver: boolean;
    startedAt: Date;
    endedAt?: Date;
  }) {
    if (game.isOver === undefined) {
      throw new Error("isOver is required");
    }
    if (!game.startedAt) {
      throw new Error("startedAt is required");
    }
  }

  getId(): number | undefined {
    return this.id;
  }

  getIsOver(): boolean {
    return this.isOver;
  }

  getStartedAt(): Date {
    return this.startedAt;
  }

  getEndedAt(): Date | undefined {
    return this.endedAt;
  }

  setId(id: number): void {
    this.id = id;
  }

  setIsOver(isOver: boolean): void {
    this.isOver = isOver;
  }

  setStartedAt(startedAt: Date): void {
    this.startedAt = startedAt;
  }

  setEndedAt(endedAt: Date): void {
    this.endedAt = endedAt;
  }


  static from(gamePrisma: GamePrisma): Game {
    return new Game({
      id: gamePrisma.id,
      isOver: gamePrisma.isOver,
      startedAt: gamePrisma.startedAt,
      endedAt: gamePrisma.endedAt ?? undefined,
      winStrat: gamePrisma.winStrat,
    });
  }
}
