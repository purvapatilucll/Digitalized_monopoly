import { Steal as StealPrisma } from "@prisma/client";

export class Steal {
    private id?: number;
    private stealerPiece: string;
    private stealersIp?: string;
    private victimPiece: string;
    private amount: number;
    private timeStamp: Date;

    constructor(steal: {
        id?: number;
        stealerPiece: string;
        stealersIp?: string;
        victimPiece: string;
        amount: number;
        timeStamp: Date;
    }) {
        this.validate(steal);
        this.id = steal.id;
        this.stealerPiece = steal.stealerPiece;
        this.stealersIp = steal.stealersIp;
        this.victimPiece = steal.victimPiece;
        this.amount = steal.amount;
        this.timeStamp = steal.timeStamp;
    }

    private validate(steal: {
        id?: number;
        stealerPiece: string;
        stealersIp?: string;
        victimPiece: string;
        amount: number;
        timeStamp: Date;
    }) {
        if (!steal.stealerPiece) {
            throw new Error("Stealer Piece is required");
        }
        if (!steal.victimPiece) {
            throw new Error("Victim Piece is required");
        }
        if (steal.amount < 0) {
            throw new Error("Amount is too low. You're negative.");
        }
    }

    getId(): number | undefined {
        return this.id;
    }

    getStealerPiece(): string {
        return this.stealerPiece;
    }

    getStealersIp(): string | undefined{
        return this.stealersIp;
    }

    getVictimPiece(): string {
        return this.victimPiece;
    }

    getAmount(): number {
        return this.amount;
    }

    getTimeStamp(): Date {
        return this.timeStamp;
    }

    setId(id: number): void {
        this.id = id;
    }

    setStealerPiece(stealerPiece: string): void {
        this.stealerPiece = stealerPiece;
    }

    setStealersIp(stealersIp: string): void {
        this.stealersIp = stealersIp;
    }

    setVictimPiece(victimPiece: string): void {
        this.victimPiece = victimPiece;
    }

    setAmount(amount: number): void {
        this.amount = amount;
    }

    setTimeStamp(timeStamp: Date): void {
        this.timeStamp = timeStamp;
    }

    static from({ id, stealerPiece, victimPiece, amount, timeStamp }: StealPrisma) {
        return new Steal({ id, stealerPiece, victimPiece, amount, timeStamp });
    }
}