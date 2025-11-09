import type { Request, Response } from "express";

import logger from "../utils/logger.js";
import * as minerService from "../services/minerService.js";
import { formatValidationError } from "../utils/handleValidationError.js";

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
        logger.info("Fetching all miners");

        // Call service to get all miners
        const miners = await minerService.getAllMiners();
        logger.info(`Fetched ${miners.length} miners`);

        res.json(miners);
    } 
    catch (error) {
        logger.error(`Error fetching all miners: ${error}`);
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
        logger.info(`Attempting to create miner with data: ${JSON.stringify(req.body)}`);

        // Call service to create the miner
        const newMiner = await minerService.createMiner(req.body);
        logger.info(`Miner created successfully with ID: ${newMiner._id}`);

        res.status(201).json(newMiner);
    } 
    catch (error: any) {
        // Handle invalid ObjectId error
        if (error.name === "ValidationError") {
            logger.warn(`Validation error creating miner: ${error.message}`);
            const errors = formatValidationError(error);
            return res.status(400).json({ error: "Validation failed", details: errors });
        }

        logger.error(`Error creating miner: ${error}`);
        res.status(500).json({ error: "Error creating miner" });
    }
}

/**
 * Controller to delete a miner.
 * 
 * @param req Express request object.
 * @param res Express response object.
 * @returns JSON response with the deleted miner.
 * @throws Error (HTTP 500) if there is an issue deleting the miner.
 */
export const deleteMiner = async (req: Request, res: Response) => {
    try {
        // Get miner ID from request parameters
        const { id } = req.params;
        logger.info(`Attempting to delete miner with ID: ${id}`);

        // Call service to delete the miner
        const deletedMiner = await minerService.deleteMiner(id!);

        // If no miner was deleted, it means it was not found
        if (!deletedMiner) {
            logger.warn(`Miner with ID ${id} not found`);
            return res.status(404).json({ error: "Miner not found" });
        }
        logger.info(`Miner with ID ${id} deleted successfully`);

        res.status(204).json(deletedMiner);
    } 
    catch (error: any) {
        // Handle invalid ObjectId error
        if (error.name === "CastError" && error.path === "_id") {
            logger.warn(`Invalid ObjectId provided: ${error.value}`);
            return res.status(400).json({ error: "Invalid miner ID format" });
        }

        logger.error(`Error deleting miner: ${error}`);
        res.status(500).json({ error: "Error deleting miner" });
    }
}