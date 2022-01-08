import { ModifyProductInput, NewProductInput, ProductArgs, ProductNotFoundError } from './product.helpers'
import { ProductModel } from './product.schema'

export default class ProductService {
    public async findById(id: string) {
        try {
            return await ProductModel.findById(id)
        } catch (err) {
            throw ProductNotFoundError(id)
        }
    }

    public async findAll({ skip, limit = 10 }: ProductArgs) {
        return await ProductModel
            .find({})
            .skip(skip)
            .limit(limit)
    }

    public async addProduct({ name, description, unitPrice }: NewProductInput) {
        try {
            return await ProductModel.create({ name, description, unitPrice })
        }
        catch (err) {
            return { name: err.name, message: err.message }
        }
    }

    public async modifyProduct({ _id, description, unitPrice }: ModifyProductInput): Promise<Boolean> {
        const updated = await ProductModel.updateOne({ _id }, { description, unitPrice })
        if (updated.modifiedCount !== 1) {
            return false
        }
        return true
    }

    public async deleteProduct(_id: string): Promise<Boolean> {
        const { deletedCount } = await ProductModel.deleteOne({ _id })
        if (deletedCount === 0) {
            return false
        }
        return true
    }
}