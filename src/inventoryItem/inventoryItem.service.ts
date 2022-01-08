import { updateInventoryInput, NewInventoryInput, InventoryArgs, InventoryNotFoundError } from './inventoryItem.helpers'
import InventoryItemModel from './inventoryItem.model'

export default class InventoryService {
    public async findById(id: string) {
        try {
            return await InventoryItemModel
                .findById(id)
                .populate('Product Warehouse')
        } catch (err) {
            throw InventoryNotFoundError(id)
        }
    }

    public async findAll({ skip, limit = 10 }: InventoryArgs) {
        return await InventoryItemModel
            .find({})
            .populate('Product Warehouse')
            .skip(skip)
            .limit(limit)
    }

    public async addInventoryItem({ stock, Product, Warehouse }: NewInventoryInput) {
        try {
            return await InventoryItemModel.create({ stock, Product, Warehouse })
        }
        catch (err) {
            return { name: err.name, message: err.message }
        }
    }

    public async updateStock({ _id, changeStockBy }: updateInventoryInput): Promise<Boolean> {
        const updated = await InventoryItemModel.updateOne({ _id },
            {
                $inc: {
                    stock: changeStockBy
                }
            })

        if (updated.modifiedCount !== 1) {
            return false
        }
        return true
    }

    public async setStock({ _id, stock }: updateInventoryInput): Promise<Boolean> {
        const updated = await InventoryItemModel.updateOne({ _id }, { stock })

        if (updated.modifiedCount !== 1) {
            return false
        }
        return true
    }

    public async deleteItem(_id: string): Promise<Boolean> {
        const { deletedCount } = await InventoryItemModel.deleteOne({ _id })
        if (deletedCount === 0) {
            return false
        }
        return true
    }
}