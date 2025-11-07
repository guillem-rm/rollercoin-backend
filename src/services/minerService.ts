import { Miner } from "../models/Miner.js";

/**
 * Service to get all miners from the database.
 * 
 * @returns Array of all miners
 */
export const getAllMiners = async () => {
    return await Miner.find();
}

/**
 * Service to create a new miner in the database.
 * 
 * @param minerData Data for the new miner
 * @returns The newly created miner
 */
export const createMiner = async (minerData: typeof Miner) => {
    return await Miner.create(minerData);
}