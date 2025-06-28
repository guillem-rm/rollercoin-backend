import { Router } from "express"
import { getMiners, getMiner, createMiner, deleteMiner } from "../controllers/minersController"

const router = Router()

router.get("/", getMiners)
router.get("/:id", getMiner)
router.post("/", createMiner)
router.delete("/:id", deleteMiner)

export default router
