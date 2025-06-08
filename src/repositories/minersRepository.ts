import { Miner } from "../models/Miner"
import { pool } from "../config/db"

export class MinersRepository {

    getAllMiners = async () => {
        const [rows] = await pool.query(
            "SELECT * FROM miners"
        )
        return rows as Miner[]
    }

}