export interface Miner {
    id: number
    rarity: "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY" | "UNREAL" | "LEGACY"
    name: string
    description?: string
    cells: number
    power: number
    bonus: number
    price: number
    created_at: Date
}