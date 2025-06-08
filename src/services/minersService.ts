import { MinersRepository } from "../repositories/minersRepository"

const minersRepository = new MinersRepository()

export const getAllMiners = async () => {
    return minersRepository.getAllMiners()
}