import express from "express"
import cors from "cors"
import path from "path"

import minersRoutes from "./routes/minersRoutes"
import mediaRoutes from "./routes/mediaRoutes"

const app = express()

app.use(cors())

app.use(express.json())

app.use(express.static(path.join(__dirname, "public")))

app.use("/miners", minersRoutes)
app.use("/media", mediaRoutes)

export default app
