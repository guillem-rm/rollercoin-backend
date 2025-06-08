import { Router } from "express"
import { getMiners } from "../controllers/minersController"

const router = Router()

router.get("/", getMiners)

export default router
