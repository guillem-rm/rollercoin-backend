import { Request, Response } from "express"
import path from "path"

import { normalizeMinerName } from "../utils/miner"

export const getMinerGif = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.query

        if (!name || typeof name !== "string") {
            res.status(400).send("Miner name is required")
        }

        const minerNameNormalized = normalizeMinerName(name as string)
        const filename = `${minerNameNormalized}.gif`
        const gifPath = path.join(__dirname, "../../public/miners", filename as string)

        res.sendFile(gifPath, (err) => {
            if (err) {
                res.status(404).send("GIF not found")
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch miner GIF",
            error: error instanceof Error ? error.message : String(error),
        })
    }
}

export const getRarityImg = async (req: Request, res: Response): Promise<void> => {
    try {
        const { type } = req.query

        if (!type || typeof type !== "string") {
            res.status(400).send("Rarity type is required")
        }

        const rarity = (type as string).toUpperCase()
        const filename = `${rarity}.png`
        const imgPath = path.join(__dirname, "../../public/rarities", filename as string)

        res.sendFile(imgPath, (err) => {
            if (err) {
                res.status(404).send("Rarity not found")
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch rarity",
            error: error instanceof Error ? error.message : String(error),
        })
    }
}