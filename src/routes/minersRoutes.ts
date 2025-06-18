import { Router } from "express"
import { getMiners, createMiner, deleteMiner } from "../controllers/minersController"

const router = Router()

router.get("/", getMiners)
router.post("/", createMiner)
router.delete("/:id", deleteMiner)

export default router
