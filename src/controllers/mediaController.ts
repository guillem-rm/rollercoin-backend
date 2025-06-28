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