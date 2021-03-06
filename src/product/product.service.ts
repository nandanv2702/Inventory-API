import { ObjectId } from 'mongoose'
import { ModifyProductInput, NewProductInput, ProductArgs, ProductNotFoundError } from './product.helpers'
import ProductModel from './product.model'

export default class ProductService {
    public async findById(id: string | ObjectId) {
        try {
            return await ProductModel
                .findById(id)
        } catch (err) {
            throw ProductNotFoundError(id)
        }
    }

    public async findByName(name: string) {
        try {
            return await ProductModel.findOne({ name })
        } catch (err) {
            throw ProductNotFoundError(name)
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
            return await ProductModel.create({ name: name.trim(), description: description.trim(), unitPrice })
        }
        catch (err) {
            return { name: err.name, message: err.message }
        }
    }

    public async modifyProduct({ _id, description, unitPrice }: ModifyProductInput): Promise<Boolean> {
        const updated = await ProductModel.updateOne({ _id }, { description: description.trim(), unitPrice })
        if (updated.modifiedCount !== 1) {
            return false
        }
        return true
    }

    public async deleteProduct(_id: string | ObjectId): Promise<Boolean> {
        const { deletedCount } = await ProductModel.deleteOne({ _id })
        if (deletedCount === 0) {
            return false
        }
        return true
    }
}