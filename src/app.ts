import express from "express"

import minersRoutes from "./routes/minersRoutes"

const app = express()

app.use(express.json())

app.use("/miners", minersRoutes)

export default app
