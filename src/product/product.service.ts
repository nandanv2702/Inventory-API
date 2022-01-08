import { NewProductInput, ProductArgs, ProductNotFoundError } from './product.helpers'
import { ProductModel } from './product.schema'

export default class ProductService {
    public async findById(id: string) {
        try {
            return ProductModel.findById(id)
        } catch(err) {
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
        return ProductModel.create({ name, description, unitPrice })
    }
}