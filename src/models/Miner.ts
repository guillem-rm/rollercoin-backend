import { Schema, model, Document } from "mongoose";

import { MinerCategory } from "../types/enums.js";

export interface Category {
    power: number;
    bonus: number;
    price?: number;
}

export interface MinerDocument extends Document {
    name: string;
    imageUrl?: string;
    cells: 1 | 2;
    sellable: boolean;
    mergeable: boolean;
    categories: Record<MinerCategory, Category>;
}

const CategorySchema = new Schema<Category>({
    power: { type: Number, required: true },
    bonus: { type: Number, required: true },
    price: { type: Number },
});

const MinerSchema = new Schema<MinerDocument>({
    name: { type: String, required: true },
    imageUrl: { type: String },
    cells: { type: Number, required: true },
    sellable: { type: Boolean, required: true },
    mergeable: { type: Boolean, required: true },
    categories: {
        type: Map,
        of: CategorySchema,
        required: true,
    },
}, { timestamps: true });

export const Miner = model<MinerDocument>('Miner', MinerSchema);