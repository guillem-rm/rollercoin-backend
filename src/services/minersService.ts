import { MinersRepository } from "../repositories/minersRepository"

const minersRepository = new MinersRepository()

export const getAllMiners = async () => {
    return minersRepository.findAll()
}

export const addMiner = async (minerData: any) => {
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