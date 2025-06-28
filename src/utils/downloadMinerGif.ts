import fetch from "node-fetch"
import { createWriteStream, existsSync } from "fs"
import { pipeline } from "stream"
import { promisify } from "util"
import path from "path"

const streamPipeline = promisify(pipeline)

export async function downloadMinerGif(url: string, minerName: string) {
    try {
        const filename = `${minerName.replace(/\s+/g, "_")}.gif`
        const savePath = path.resolve(__dirname, "../../public/miners", filename)

        if (existsSync(savePath)) return

        const response = await fetch(url)
        if (!response.ok) throw new Error(`Error downloading: ${response.statusText}`)

        if (!response.body) throw new Error("Response body is null")
        await streamPipeline(response.body as NodeJS.ReadableStream, createWriteStream(savePath))
    } catch (err) {
        console.error("Error downloading gif:", err)
    }
}