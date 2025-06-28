import { Router } from "express"
import { getMinerGif } from "../controllers/mediaController"

const router = Router()

router.get("/miner/gif", getMinerGif)

export default router
