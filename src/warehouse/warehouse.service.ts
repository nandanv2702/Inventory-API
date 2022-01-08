import { ModifyWarehouseInput, NewWarehouseInput, WarehouseArgs, WarehouseNotFoundError } from './warehouse.helpers'
import { WarehouseModel } from './warehouse.schema'

export default class WarehouseService {
    public async findById(id: string) {
        try {
            return await WarehouseModel.findById(id)
        } catch (err) {
            throw WarehouseNotFoundError(id)
        }
    }

    public async findAll({ skip, limit = 10 }: WarehouseArgs) {
        return await WarehouseModel
            .find({})
            .skip(skip)
            .limit(limit)
    }

    public async addWarehouse({ name, streetAddress, zipCode }: NewWarehouseInput) {
        try {
            return await WarehouseModel.create({ name, streetAddress, zipCode })
        }
        catch (err) {
            return { name: err.name, message: err.message }
        }
    }

    public async modifyWarehouse({ _id, streetAddress, zipCode }: ModifyWarehouseInput): Promise<Boolean> {
        const updated = await WarehouseModel.updateOne({ _id }, { streetAddress, zipCode })
        if (updated.modifiedCount !== 1) {
            return false
        }
        return true
    }

    public async deleteProduct(_id: string): Promise<Boolean> {
        const { deletedCount } = await WarehouseModel.deleteOne({ _id })
        if (deletedCount === 0) {
            return false
        }
        return true
    }
}