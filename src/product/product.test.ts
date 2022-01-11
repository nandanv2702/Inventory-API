import { setupConnection, closeDatabase, mongoserver } from '../../test-utils/setup'
import { gCall } from '../../test-utils/gCall'
import { MongoMemoryServer } from 'mongodb-memory-server';
import ProductService from '../product/product.service'

const productDb = new ProductService()

let mongod: MongoMemoryServer
beforeAll(async () => {
    mongod = await mongoserver()
    await setupConnection(mongod)
});

afterAll(async () => {
    await closeDatabase(mongod)
});

describe('Product Resolver', () => {
    it('should create a product', async () => {
        const result = await gCall({
            source: addProductMutation,
            variableValues: seedData
        })

        expect(result!.data).toBeDefined()
        expect(result!.data!.addProduct).toEqual(
            expect.objectContaining(seedData)
        )

        const dbCall = await productDb.findById(result!.data!.addProduct._id)

        expect(dbCall).toBeDefined()
        expect(dbCall!.description).toEqual(seedData.description)
        expect(dbCall!.name).toEqual(seedData.name)
        expect(dbCall!.unitPrice).toEqual(seedData.unitPrice)
    })

    it('should not create a product with the same name', async () => {
        const duplicate = await gCall({
            source: addProductMutation,
            variableValues: seedData
        })

        expect(duplicate.data).toBeNull()
        expect(duplicate.errors).toBeDefined()

        const allProducts = await productDb.findAll({ skip: 0, limit: 10 })

        expect(allProducts).toHaveLength(1)
    })

    it('should correctly modify information', async () => {
        const existingInfo = await productDb.findByName(seedData.name)

        expect(existingInfo).toHaveProperty('_id')
        expect(existingInfo).toEqual(
            expect.objectContaining(seedData)
        )

        const modified = await gCall({
            source: modifyProductMutation,
            variableValues: {
                "id": existingInfo!._id.toString(),
                "description": "new description",
                "unitPrice": 4550
            }
        })

        expect(modified).toHaveProperty('data.modifyProduct')
        expect(modified!.data!.modifyProduct).toBeTruthy()

        const modifiedRecord = await productDb.findByName(seedData.name)

        expect(modifiedRecord).toEqual(
            expect.objectContaining({
                _id: existingInfo!._id,
                name: seedData.name,
                description: "new description",
                unitPrice: 4550
            })
        )
    })
})

const seedData = {
    "name": "test product",
    "description": "test description",
    "unitPrice": 6000
}

const addProductMutation = `
mutation Mutation($name: String!, $description: String!, $unitPrice: Float!) {
  addProduct(name: $name, description: $description, unitPrice: $unitPrice) {
    _id
    description
    name
    unitPrice
  }
}`

const modifyProductMutation = `mutation Mutation($id: String!, $description: String!, $unitPrice: Float!) {
  modifyProduct(_id: $id, description: $description, unitPrice: $unitPrice)
}`