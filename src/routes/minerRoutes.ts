import { Router } from "express";

import * as minerController from "../controllers/minerController.js";

const router = Router();

/**
 * @route GET /miners
 * @desc Get all miners.
 */
router.get("/", minerController.getAllMiners);

/**
 * @route POST /miners
 * @desc Create a new miner.
 */
router.post("/", minerController.createMiner);

/**
 * @route DELETE /miners/:id
 * @desc Deletes a miner.
 */
router.delete("/:id", minerController.deleteMiner);

/**
 * @route POST /miners/scrap
 * @desc Triggers the miner scraping process.
 */
router.post("/scrape", minerController.startMinerScraper);

/**
 * @route GET /miners/scrape/status
 * @desc Gets the status of the miner scraping process.
 */
router.get("/scrape/status", minerController.getScraperStatus);

export default router;