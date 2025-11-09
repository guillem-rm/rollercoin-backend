import logger from "../utils/logger.js";
import { Miner, type MinerDocument } from "../models/Miner.js";

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
 * Service to create or update a miner in the database.
 * If a miner with the same name exists, it will be updated.
 * Otherwise, a new miner will be created.
 * 
 * @param minerData Data for the miner
 * @returns The created or updated miner
 */
export const upsertMiner = async (minerData: Partial<MinerDocument>) => {
    logger.debug(`Upserting miner with data: ${JSON.stringify(minerData)}`);

    // Upsert the miner
    const miner = await Miner.findOneAndUpdate(
        { name: minerData.name },
        minerData,
        { upsert: true, new: true, runValidators: true }
    );
    if (!miner) logger.debug(`Failed to upsert miner: ${JSON.stringify(minerData)}`);
    else logger.debug(`Miner upserted with ID: ${miner._id}`);

    return miner;
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