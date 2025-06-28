import express from "express"
import cors from "cors"

import minersRoutes from "./routes/minersRoutes"

const app = express()

app.use(cors())

app.use(express.json())

app.use("/miners", minersRoutes)

export default app
