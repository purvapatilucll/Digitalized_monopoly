export class StealToken {
    private readonly id?: string;
    private readonly createdAt: Date;
    private readonly expiresAt: Date;

    constructor(stealToken: {
        id?: string;
        createdAt: Date;
        expiresAt: Date;
    }) {
        this.validate(stealToken);
        this.id = stealToken.id;
        this.createdAt = stealToken.createdAt;
        this.expiresAt = stealToken.expiresAt;
    }

    private validate(stealToken: {
        id?: string;
        createdAt: Date;
        expiresAt: Date;
    }) {
        if (!stealToken.createdAt) {
            throw new Error("Created At is required");
        }
        if (!stealToken.expiresAt) {
            throw new Error("Expires At is required");
        }
    }

    getId(): string | undefined {
        return this.id;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getExpiresAt(): Date {
        return this.expiresAt;
    }

    static from(stealToken: {
        id?: string;
        createdAt: Date;
        expiresAt: Date;
    }): StealToken {
        return new StealToken({
            id: stealToken.id,
            createdAt: stealToken.createdAt,
            expiresAt: stealToken.expiresAt,
        });
    }
}