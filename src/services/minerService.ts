import logger from "../utils/logger.js";
import { Miner } from "../models/Miner.js";

/**
 * Service to get all miners from the database.
 * 
 * @returns Array of all miners
 */
export const getAllMiners = async () => {
    logger.debug("Fetching all miners from DB");

    // Fetch all miners
    const miners = await Miner.find();
    if (!miners) logger.debug("No miners found in DB");
    else logger.debug(`Found ${miners.length} miners in DB`);

    return miners;
}

/**
 * Service to create a new miner in the database.
 * 
 * @param minerData Data for the new miner
 * @returns The newly created miner
 */
export const createMiner = async (minerData: typeof Miner) => {
    logger.debug(`Creating new miner in DB with data: ${JSON.stringify(minerData)}`);

    // Create the miner
    const newMiner = await Miner.create(minerData);
    if (!newMiner) logger.debug(`Failed to create new miner with data: ${JSON.stringify(minerData)}`);
    else logger.debug(`New miner created with ID: ${newMiner._id}`);

    return newMiner;
}

/**
 * Service to delete a miner from the database.
 * 
 * @param minerId Identifier of the miner to delete
 * @returns The deleted miner
 */
export const deleteMiner = async (minerId: string) => {
    logger.debug(`Deleting miner from DB with ID: ${minerId}`);

    // Delete the miner
    const deletedMiner = await Miner.findByIdAndDelete(minerId);
    if (!deletedMiner) logger.debug(`No miner found with ID: ${minerId}`);
    else logger.debug(`Miner deleted with ID: ${minerId}`);

    return deletedMiner;
}