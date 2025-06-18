import { Request, Response } from "express"

import { getAllMiners, addMiner, deleteMinerById } from "../services/minersService"

export const getMiners = async (req: Request, res: Response): Promise<void> => {
    try {
        const miners = await getAllMiners()

        res.status(200).json({
            data: miners,
            count: miners.length,
            message: "Miners fetched successfully",
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch miners",
            error: error instanceof Error ? error.message : String(error),
        })
    }
}

export const createMiner = async (req: Request, res: Response): Promise<void> => {
    try {
        const miner = await addMiner(req.body)
        res.status(201).json({
            data: miner,
            message: "Miner created successfully",
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to create miner",
            error: error instanceof Error ? error.message : String(error),
        })
    }
}

export const deleteMiner = async (req: Request, res: Response): Promise<void> => {
    try {
        await deleteMinerById(Number(req.params.id))
        res.status(200).json({
            message: "Miner deleted successfully",
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete miner",
            error: error instanceof Error ? error.message : String(error),
        })
    }
}