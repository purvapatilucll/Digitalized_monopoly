import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import WebSocket, { WebSocketServer } from 'ws';
import http from "http";

import { userRouter } from "../controller/user.routes";
import { cardRouter } from "../controller/card.routes";
import { scanRouter } from "../controller/scan.routes";
import { transactionRouter } from "../controller/transaction.routes";
import { gameRouter } from "../controller/game.routes";
import { stealRouter } from "../controller/steal.routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:8080",
  "https://frontend-itip-project26.apps.okd.ucll.cloud",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));

app.get("/status", (req: Request, res: Response) => {
  res.send("Back end is running");
});

app.use("/users", userRouter);
app.use("/cards", cardRouter);
app.use("/scans", scanRouter);
app.use("/transactions", transactionRouter);
app.use("/games", gameRouter);
app.use("/steals", stealRouter);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });


//    WS
interface ExtendedWebSocket extends WebSocket {
  isAlive: boolean;
}

wss.on("connection", (ws) => {
  const extWs = ws as unknown as  ExtendedWebSocket;
  console.log("Client connected");
  extWs.isAlive = true;

  extWs.on("pong", () => {
    extWs.isAlive = true;
  });

  extWs.on("message", (data) => {
    try {
      const message = JSON.parse(data.toString());
      if (message.event === "ping") {
        extWs.send(JSON.stringify({ event: "pong" }));
        extWs.isAlive = true;
      }
    } catch (err) {
      console.error("Error parsing message", err);
    }
  });

  extWs.on("close", () => {
    console.log("Client disconnected");
  });
});

setInterval(() => {
  wss.clients.forEach((ws) => {
    const extWs = ws as unknown as ExtendedWebSocket;

    if (!extWs.isAlive) {
      console.log("Terminating dead connection");
      return extWs.terminate();
    }

    extWs.isAlive = false;
    extWs.ping();
  });
}, 30000);

server.listen(3000, () => {
  console.log("Server and WebSocket running on http://localhost:3000");
});

export { wss };
