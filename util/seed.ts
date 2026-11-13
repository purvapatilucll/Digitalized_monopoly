// npx ts-node util/seed.ts

import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { set } from "date-fns";

dotenv.config();
const prisma = new PrismaClient();

const date1 = set(new Date(), { hours: 0, minutes: 0 });
const players = [
  "bank",
  "airplane",
  "sk8board",
  "racecar",
  "flip-phone",
  "rollersk8",
  "hamburger",
];
const allowedAmounts = [
  "100k",
  "150k",
  "200k",
  "250k",
  "300k",
  "350k",
  "400k",
  "450k",
  "500k",
];

const getRandomPlayer = () => {
  return players[Math.floor(Math.random() * players.length)];
};
const getRandomAmount = () => {
  return allowedAmounts[Math.floor(Math.random() * allowedAmounts.length)];
};

const main = async () => {
  await prisma.steal.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.scan.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.card.deleteMany();

  await prisma.user.deleteMany();
  await prisma.game.deleteMany();

  const bank = await prisma.user.create({
    data: {
      cardName: "bank",
      piece: "bank",
      balance: 777,
      balanceHistory: [777],
      role: "bank",
    },
  });

  const user1 = await prisma.user.create({
    data: {
      cardName: "ba510e3",
      piece: "airplane",
      balance: 19000000,
      balanceHistory: [15000000, 13000000, 14000000, 19000000],
      role: "player",
      Protected: 2
    },
  });

  const user2 = await prisma.user.create({
    data: {
      cardName: "2bc81ce3",
      piece: "sk8board",
      balance: 16000000,
      balanceHistory: [1500000, 17000000, 18000000, 16000000],
      role: "player",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      cardName: "8bd93fe3",
      piece: "racecar",
      balance: 13000000,
      balanceHistory: [15000000, 16500000, 15500000, 13000000],
      role: "player",
    },
  });

  const user4 = await prisma.user.create({
    data: {
      cardName: "7b681ee3",
      piece: "flip-phone",
      balance: 12000000,
      role: "player",
      balanceHistory: [15000000, 12000000, 13500000, 12000000],
    },
  });

  const user5 = await prisma.user.create({
    data: {
      cardName: "367qzl222",
      piece: "rollersk8",
      balance: 19000000,
      balanceHistory: [15000000, 15050000, 15020000, 19000000],
      role: "player",
      Ddossed: 2
    },
  });

  const user6 = await prisma.user.create({
    data: {
      cardName: "cba941e3",
      piece: "hamburger",
      balance: 20000000,
      balanceHistory: [15000000, 16000000, 15200000, 20000000],
      role: "player",
    },
  });

  const chestCard1 = await prisma.card.create({
    data: {
      message: "Pay a fine of $100k or draw a 'chance' card. Scan your choice",
      outcome: 0,
      type: "chest",
    },
  });

  const chestCard2 = await prisma.card.create({
    data: {
      message: "Your car insurance pays you $250k.",
      outcome: 250000,
      type: "chest",
    },
  });

  const chestCard3 = await prisma.card.create({
    data: {
      message:
        "U loan your villa in Toscana to your friends. Each player pays you $100k.",
      outcome: 0, // Change this to 100k * amount of players
      type: "chest",
    },
  });

  const chestCard4 = await prisma.card.create({
    data: {
      message: "Pay $500k for a luxurious vacation in a 5 star hotel.",
      outcome: -500000,
      type: "chest",
    },
  });

  const chestCard5 = await prisma.card.create({
    data: {
      message:
        "You buy a vintage item at a garage sale. You make a HUGE profit of $200k.",
      outcome: 200000,
      type: "chest",
    },
  });

  const chestCard6 = await prisma.card.create({
    data: {
      message: "Your internet company makes a lot of profit. You receive $2M.",
      outcome: 2000000,
      type: "chest",
    },
  });

  const chestCard7 = await prisma.card.create({
    data: {
      message: "Go back to 'Rue du commerce' in Wavre.",
      outcome: 0,
      type: "chest",
    },
  });

  const chestCard8 = await prisma.card.create({
    data: {
      message: "You payed too much taxes. You receive $500k.",
      outcome: 500000,
      type: "chest",
    },
  });

  const chestCard9 = await prisma.card.create({
    data: {
      message: "You loan your private jet. You earn $1M.",
      outcome: 1000000,
      type: "chest",
    },
  });

  const chestCard10 = await prisma.card.create({
    data: {
      message: "You loan the atomium for a private party. You pay $1M.",
      outcome: -1000000,
      type: "chest",
    },
  });

  const chestCard11 = await prisma.card.create({
    data: {
      message: "Congratulations! You won a television contest. You win $100k.",
      outcome: 100000,
      type: "chest",
    },
  });

  const chestCard12 = await prisma.card.create({
    data: {
      message: "You commited fraud. Go straight to jail.",
      outcome: 0,
      type: "chest",
    },
  });

  const chestCard13 = await prisma.card.create({
    data: {
      message: "You broke an antique vase. You pay $500k for the restoration.",
      outcome: -500000,
      type: "chest",
    },
  });

  const chestCard14 = await prisma.card.create({
    data: {
      message: "Go to 'START'",
      outcome: 0,
      type: "chest",
    },
  });

  const chestCard15 = await prisma.card.create({
    data: {
      message:
        "Your grandma dies. You inherit $3M. But you have to pay $2M on taxes. You receive $1M.",
      outcome: 1000000,
      type: "chest",
    },
  });

  const chestCard16 = await prisma.card.create({
    data: {
      message:
        "Get out of jail free card! You can keep this card or sell it to another player.",
      outcome: 0,
      type: "chest",
      // store: true,
    },
  });

  const ChanceCards = [
    {
      message: "Continue to start.",
      outcome: 0,
      type: "chance",
    },
    {
      message: "Pay 1.5M for the private school of your kids.",
      outcome: -1500000,
      type: "chance",
    },
    {
      message:
        "Continue to Huidevetterstraat in Antwerpen if you pass by start, u collect $2M.",
      outcome: 0,
      type: "chance",
    },
    {
      message: "Sell your shares with profit of 1.5M",
      outcome: 1500000,
      type: "chance",
    },
    {
      message:
        "You leave for the sun and take the plane from L'Aéroport de Charleroi, if you pass by start, u collect $2M.",
      outcome: 0,
      type: "chance",
    },
    {
      message:
        "You have your properties redesigned by famous architects. Pay 250k for every property. Pay 1M for every hotel.",
      outcome: 0, // Change this to 250k * amount of properties + 1M * amount of hotels
      type: "chance",
    },
    {
      message: "Congratulations! You won the lottery. You win $1M.",
      outcome: 1000000,
      type: "chance",
    },
    {
      message: "Evening rush hour... Traffic jam! Go back three places.",
      outcome: 0,
      type: "chance",
    },
    {
      message:
        "Continue to De Grand'Rue in Arlon. If you pass by start, u collect $2M.",
      outcome: 0,
      type: "chance",
    },
    {
      message: "Go directly to jail. Do not pass by start. Do not collect $2M.",
      outcome: 0,
      type: "chance",
    },
    {
      message:
        "Pay the land registry 400k per apartment and 1.15M per hotel in your possession",
      outcome: 0, // Change this to 400k * amount of apartments + 1.15M * amount of hotels
      type: "chance",
    },
    {
      message:
        "Get out of jail free. You can keep this card for own use or sell it.",
      outcome: 0,
      type: "chance",
    },
    {
      message:
        "You get caught for calling without handsfree kit while driving. You pay 150K.",
      outcome: -150000,
      type: "chance",
    },
    {
      message:
        "You sell your shopping mall on the Lippenslaan in Knokke for 500k",
      outcome: 500000,
      type: "chance",
    },
    {
      message:
        "Build a swimming pool on the roof of your apartment building on the Meir in Antwerp. Pay 200K",
      outcome: -200000,
      type: "chance",
    },
    {
      message:
        "You decide to go on a shopping spree. Continue to the Nieuwstraat in Brussels.",
      outcome: 0,
      type: "chance",
    },
    {
      message: `STEAL, You can steal ${getRandomAmount()} from a random player.`,
      outcome: 0,
      type: "chance",
    },
    {
      message: `STEAL, You can steal ${getRandomAmount()} from a random player.`,
      outcome: 0,
      type: "chance",
    },
    {
      message: `STEAL, you can steal ${getRandomAmount()} from player any player.`,
      outcome: 0,
      type: "chance",
    },
    {
      message: `STEAL, you can steal ${getRandomAmount()} from player any player.`,
      outcome: 0,
      type: "chance",
    },
    {
      message: `STEAL, you can steal ${getRandomAmount()} from the player to your left.`,
      outcome: 0,
      type: "chance",
    },
    {
      message: `SREAL, you can steal ${getRandomAmount()} from the player to your right.`,
      outcome: 0,
      type: "chance",
    },
    {
      message: "STEAL, you lost your card at the club, pay everone 100k.",
      outcome: 0,
      type: "chance",
    },
    {
      message: `STEAL, bank gambled your money. You pay 300k to the bank.`,
      outcome: -300000,
      type: "chance",
    },
    {
      message:
        "STEAL, You got scammed by microsoft tech support. They sold all your stocks. Lose 1.5m",
      outcome: -1500000,
      type: "chance",
    },
    {
      message: `STEAL, player ${getRandomPlayer()} left his pc open. You stold all their stocks. steal 1m`,
      outcome: 0,
      type: "chance",
    },
    {
      message: `STEAL, you found someone's trading account. You can sell the stocks and run away with the winnings. gain 1m`,
      outcome: 1000000,
      type: "chance",
    },
  ];

  const createdChanceCards = [];

  for (const card of ChanceCards) {
    const createdCard = await prisma.card.create({
      data: {
        message: card.message,
        outcome: card.outcome,
        type: card.type,
      },
    });
    createdChanceCards.push(createdCard);
  }

  const transaction1 = await prisma.transaction.create({
    data: {
      timeStamp: date1,
      amount: 100000,
      sender: {
        connect: { piece: user1.piece },
      },
      receiver: {
        connect: { piece: user2.piece },
      },
    },
  });

  const transaction2 = await prisma.transaction.create({
    data: {
      timeStamp: date1,
      sender: {
        connect: { id: user2.id },
      },
      receiver: {
        connect: { id: user3.id },
      },
      amount: 15000,
    },
  });

  const transaction3 = await prisma.transaction.create({
    data: {
      timeStamp: date1,
      sender: {
        connect: { id: user3.id },
      },
      receiver: {
        connect: { id: user4.id },
      },
      amount: 1000000,
    },
  });

  const transaction4 = await prisma.transaction.create({
    data: {
      timeStamp: date1,
      sender: {
        connect: { id: user4.id },
      },
      receiver: {
        connect: { id: user5.id },
      },
      amount: 1000000,
    },
  });

  const game = await prisma.game.create({
    data: {
      isOver: false,
      startedAt: new Date(),
      endedAt: null,
      winStrat: "first_out",
    },
  });

  // Assign a few chest cards to user1 for testing
await prisma.user.update({
  where: { id: user1.id },
  data: {
    cards: {
      connect: [
        { id: chestCard1.id },
        { id: chestCard2.id },
        { id: chestCard3.id },
      ],
    },
  },
});

// Assign a couple chance cards to user1 for testing
await prisma.user.update({
  where: { id: user1.id },
  data: {
    cards: {
      connect: [
        { id: createdChanceCards[0].id },
        { id: createdChanceCards[1].id },
      ],
    },
  },
});
};



(async () => {
  try {
    await main();
    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
