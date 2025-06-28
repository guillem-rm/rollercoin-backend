import { Router } from "express"

import { getMinerGif, getRarityImg } from "../controllers/mediaController"

const router = Router()

router.get("/miner/gif", getMinerGif)
router.get("/rarity", getRarityImg)

export default router
