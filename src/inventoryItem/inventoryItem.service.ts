import { updateStockInput, NewInventoryInput, InventoryArgs, InventoryNotFoundError, setStockInput } from './inventoryItem.helpers'
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

    public async find(args: any) { return await InventoryItemModel.find(args) }

    public async addInventoryItem({ stock, Product, Warehouse }: NewInventoryInput) {
        try {
            // check if combination already exists
            const exists = await this.find({
                Product,
                Warehouse
            })

            if (exists.length > 0) {
                throw new Error('Combination already exists')
            }

            return await InventoryItemModel.create({ stock, Product, Warehouse })
        }
        catch (err) {
            return { name: err.name, message: err.message }
        }
    }

    public async updateStock({ _id, changeStockBy }: updateStockInput): Promise<Boolean> {
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

    public async setStock({ _id, stock }: setStockInput): Promise<Boolean> {
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