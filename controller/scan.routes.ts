import express, { NextFunction, Request, Response } from "express";
import scanService from "../service/scanService";
import { wss } from "../src/app";

const scanRouter = express.Router();

scanRouter.get("/", async (req, res) => {
  try {
    const scans = await scanService.getAllScans();
    res.json(scans);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch scans." });
    console.log(error);
  }
});


scanRouter.post("/blackMarket/:cardName", async (req, res) => {
  try {
    const scanningCardName = req.params.cardName;

    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({
          event: "blackMarketScanned",
          data: {
            scanningCardName,
          }
        }));
      }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to open black market" });
  }
});

scanRouter.post("/:userCardName/:typeOfScan", async (req, res) => {
  try {
    const userCardName = req.params.userCardName
    const typeOfScan = req.params.typeOfScan

    const scan = await scanService.createScan({
      userCardName,
      typeOfScan,
    });
    res.status(200).json(scan);
  } catch (error) {
    res.status(500).json({ error: "Failed to make transaction" });
    console.log(error);
  }
});

scanRouter.delete('/all', async (req: Request, res: Response) => {
  try {
    const message = await scanService.deleteAllScans();
    res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete all scans." });
  }
});

export { scanRouter };