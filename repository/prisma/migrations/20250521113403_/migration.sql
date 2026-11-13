-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "cardName" TEXT NOT NULL,
    "piece" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "balanceHistory" INTEGER[],
    "role" TEXT NOT NULL,
    "gameId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "outcome" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "played" BOOLEAN NOT NULL DEFAULT false,
    "store" BOOLEAN NOT NULL DEFAULT false,
    "userCardName" TEXT,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderPiece" TEXT NOT NULL,
    "receiverPiece" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scan" (
    "id" SERIAL NOT NULL,
    "userCardName" TEXT NOT NULL,
    "typeOfScan" TEXT NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gameId" INTEGER,

    CONSTRAINT "Scan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "isOver" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "winStrat" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Steal" (
    "id" SERIAL NOT NULL,
    "stealerPiece" TEXT NOT NULL,
    "stealersIp" TEXT NOT NULL,
    "victimPiece" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Steal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_cardName_key" ON "User"("cardName");

-- CreateIndex
CREATE UNIQUE INDEX "User_piece_key" ON "User"("piece");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_userCardName_fkey" FOREIGN KEY ("userCardName") REFERENCES "User"("cardName") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_senderPiece_fkey" FOREIGN KEY ("senderPiece") REFERENCES "User"("piece") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_receiverPiece_fkey" FOREIGN KEY ("receiverPiece") REFERENCES "User"("piece") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_userCardName_fkey" FOREIGN KEY ("userCardName") REFERENCES "User"("cardName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Steal" ADD CONSTRAINT "Steal_stealerPiece_fkey" FOREIGN KEY ("stealerPiece") REFERENCES "User"("piece") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Steal" ADD CONSTRAINT "Steal_victimPiece_fkey" FOREIGN KEY ("victimPiece") REFERENCES "User"("piece") ON DELETE RESTRICT ON UPDATE CASCADE;
