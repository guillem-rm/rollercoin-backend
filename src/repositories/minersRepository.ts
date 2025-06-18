import { pool } from "../config/db"
import { Miner } from "../models/Miner"

export class MinersRepository {

    findAll = async () => {
        const [rows] = await pool.query(
            "SELECT * FROM miners"
        )

        return rows as Miner[]
    }

    findById = async (id: number): Promise<Miner | null> => {
        const [rows] = await pool.query(
            "SELECT * FROM miners WHERE id = ?",
            [id]
        )

        const miners = rows as Miner[]
        return miners.length > 0 ? miners[0] : null
    }

    findByRarityAndName = async (rarity: string, name: string): Promise<Miner[]> => {
        const [rows] = await pool.query(
            `SELECT * FROM miners WHERE rarity = ? AND name = ?`,
            [rarity, name]
        )

        return rows as Miner[]
    }

    create = async (data: Partial<Miner>): Promise<number> => {
        const { rarity, name, description, cells, power, bonus, price } = data

        const [result] = await pool.query(
            `INSERT INTO miners (rarity, name, description, cells, power, bonus, price) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [rarity, name, description, cells, power, bonus, price]
        );

        return (result as any).insertId
    }

    delete = async (id: number): Promise<void> => {
        await pool.query(
            "DELETE FROM miners WHERE id = ?",
            [id]
        )
    }

}