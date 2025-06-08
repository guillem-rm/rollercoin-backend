import { Request, Response } from "express"

import { getAllMiners } from "../services/minersService"

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