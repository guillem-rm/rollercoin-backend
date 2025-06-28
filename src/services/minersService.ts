import { MinersRepository } from "../repositories/minersRepository"
import { downloadMinerGif } from "../utils/downloadMinerGif"

const minersRepository = new MinersRepository()

export const getAllMiners = async () => {
    return minersRepository.findAll()
}

export const getMinerById = async (id: number) => {
    return minersRepository.findById(id)
}

export const addMiner = async (minerData: any) => {
    const name = minerData.name.trim()
    const rarity = minerData.rarity.trim()

    const minerExists = await minersRepository.findByRarityAndName(rarity, name)
    if (minerExists && minerExists.length > 0) {
        return minerExists[0]
    }

    if (minerData.gifUrl) {
        await downloadMinerGif(minerData.gifUrl, minerData.name)
    }

    const id =  await minersRepository.create(minerData)
    return minersRepository.findById(id)
}

export const deleteMinerById = async (id: number) => {
    const miner = await minersRepository.findById(id)
    if (!miner) {
        throw new Error("Miner not found")
    }
    await minersRepository.delete(id)
}