import type { Request, Response } from "express";

import * as minerService from "../services/minerService.js";

/**
 * Controller to get all miners.
 * 
 * @param req Express request object.
 * @param res Express response object.
 * @returns JSON response with all miners.
 * @throws Error (HTTP 500) if there is an issue fetching miners.
 */
export const getAllMiners = async (req: Request, res: Response) => {
    try {
        const miners = await minerService.getAllMiners();
        res.json(miners);
    } catch (error) {
        res.status(500).json({ error: "Error getting all miners" });
    }
}

/**
 * Controller to create a new miner.
 * 
 * @param req Express request object.
 * @param res Express response object.
 * @returns JSON response with the newly created miner.
 * @throws Error (HTTP 500) if there is an issue creating the miner.
 */
export const createMiner = async (req: Request, res: Response) => {
    try {
        const newMiner = await minerService.createMiner(req.body);
        res.status(201).json(newMiner);
    } catch (error) {
        res.status(500).json({ error: "Error creating miner" });
    }
}