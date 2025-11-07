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

export default router;