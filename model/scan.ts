import {
  Scan as ScanPrisma,
  User as UserPrisma,
  Card as CardPrisma,
  Steal as StealPrisma,
} from "@prisma/client";
import { User } from "./user";

export class Scan {
  private id?: number;
  private userCardName: string;
  private user: User;
  private typeOfScan: string;
  private timeStamp?: Date;

  constructor(scan: {
    id?: number;
    userCardName: string;
    user: User;
    typeOfScan: string;
    timeStamp?: Date;
  }) {
    this.validate(scan);
    this.id = scan.id;
    this.userCardName = scan.userCardName;
    this.user = scan.user;
    this.typeOfScan = scan.typeOfScan;
    this.timeStamp = scan.timeStamp;
  }

  private validate(scan: {
    id?: number;
    userCardName: string;
    user: User;
    typeOfScan: string;
    timeStamp?: Date;
  }) {
    if (!scan.userCardName) {
      throw new Error("userCardName is required");
    }
    if (!scan.user) {
      throw new Error("User is required");
    }
    if (!scan.typeOfScan) {
      throw new Error("typeOfScan is required");
    }
  }

  getId(): number | undefined {
    return this.id;
  }

  getUserCardName(): string {
    return this.userCardName;
  }

  getUser(): User {
    return this.user;
  }

  getTypeOfScan(): string {
    return this.typeOfScan;
  }

  setId(id: number): void {
    this.id = id;
  }

  setUserCardName(userCardName: string): void {
    this.userCardName = userCardName;
  }

  setUser(user: User): void {
    this.user = user;
  }

  setTypeOfScan(typeOfScan: string): void {
    this.typeOfScan = typeOfScan;
  }

  static from(
    scanPrisma: ScanPrisma & { user: UserPrisma & { cards: CardPrisma[] } & { stolen: StealPrisma[] } & { robbed: StealPrisma[] } }
  ) {
    return new Scan({
      id: scanPrisma.id,
      userCardName: scanPrisma.userCardName,
      user: User.from(scanPrisma.user),
      typeOfScan: scanPrisma.typeOfScan,
      timeStamp: scanPrisma.timeStamp,
    });
  }
}
