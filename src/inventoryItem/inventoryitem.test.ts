import { setupConnection, closeDatabase, mongoserver } from '../../test-utils/setup'
import { gCall } from '../../test-utils/gCall'
import { MongoMemoryServer } from 'mongodb-memory-server';
import InventoryService from './inventoryItem.service'
// import ProductService from '../product/product.service'
// import WarehouseService from '../warehouse/warehouse.service'
import { ObjectId } from 'mongoose';


const inventoryDb = new InventoryService()
// const productDb = new ProductService()
// const warehousedDb = new WarehouseService()

let mongod: MongoMemoryServer
const productIds: ObjectId[] = []
const warehouseIds: ObjectId[] = []

beforeAll(async () => {
    mongod = await mongoserver()
    await setupConnection(mongod)

    try {
        await setupProduct();
        await setupWarehouse();
    } catch (e) {
        throw new Error(`Error: ${e.message}`)
    }
});

afterAll(async () => {
    await closeDatabase(mongod)
});

describe('Inventory Item Resolver', () => {
    it('should not create duplicate pairs', async () => {
        const initial = await gCall({
            source: addInventoryItemMutation,
            variableValues: {
                "product": productIds[0],
                "warehouse": warehouseIds[0],
                "stock": 4000
            }
        });

        expect(initial).toHaveProperty('data.addInventoryItem')
        expect(initial!.data!.addInventoryItem).toHaveProperty('_id')

        const initialId = initial!.data!.addInventoryItem!._id

        const databaseItem = await inventoryDb.findById(initialId)
        expect(databaseItem).toBeDefined()

        const duplicate = await gCall({
            source: addInventoryItemMutation,
            variableValues: {
                "product": productIds[0],
                "warehouse": warehouseIds[0],
                "stock": 4000
            }
        });

        expect(duplicate!.errors).toBeDefined()
        expect(duplicate!.data).toBeNull()
    })

    it('should not add invalid ObjectIds', async () => {
        const invalidProduct = await gCall({
            source: addInventoryItemMutation,
            variableValues: {
                "product": productIds[0] + "wkdjfniwef",
                "warehouse": warehouseIds[0],
                "stock": 4000
            }
        });

        expect(invalidProduct!.errors).toBeDefined()
        expect(invalidProduct!.data).toBeNull()

        const invalidWarehouse = await gCall({
            source: addInventoryItemMutation,
            variableValues: {
                "product": productIds[0],
                "warehouse": warehouseIds[0] + "wkdjfniwef",
                "stock": 4000
            }
        });

        expect(invalidWarehouse!.errors).toBeDefined()
        expect(invalidWarehouse!.data).toBeNull()
    })

    it('should not accept a productId for a warehouseId', async () => {
        const result = await gCall({
            source: addInventoryItemMutation,
            variableValues: {
                "product": productIds[0],
                "warehouse": productIds[0],
                "stock": 4000
            }
        });

        expect(result!.errors).toBeDefined()
        expect(result!.data).toBeNull()
    })

    it('should not accept a warehouseId for a productId', async () => {
        const result = await gCall({
            source: addInventoryItemMutation,
            variableValues: {
                "product": warehouseIds[0],
                "warehouse": warehouseIds[0],
                "stock": 4000
            }
        });

        expect(result!.errors).toBeDefined()
        expect(result!.data).toBeNull()
    })
})

const productData = {
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

const warehouseData = {
    "name": "test warehouse",
    "streetAddress": "1234 valid street",
    "zipCode": "17101"
}

const addWarehouseMutation = `
mutation Mutation($name: String!, $streetAddress: String!, $zipCode: String!) {
  addWarehouse(name: $name, streetAddress: $streetAddress, zipCode: $zipCode) {
    _id
    name
    streetAddress
    zipCode
  }
}`

async function setupProduct() {
    const result = await gCall({
        source: addProductMutation,
        variableValues: productData
    });

    console.log(result!.data!.addProduct);


    expect(result).toHaveProperty('data.addProduct._id')

    console.log(`ID is ${result!.data!.addProduct._id}`);

    productIds.push(result!.data!.addProduct._id);
}

async function setupWarehouse() {
    const result = await gCall({
        source: addWarehouseMutation,
        variableValues: warehouseData
    });

    expect(result).toHaveProperty('data.addWarehouse._id')

    console.log(`Warehouse ID is ${result!.data!.addWarehouse._id}`);

    warehouseIds.push(result!.data!.addWarehouse._id);
}

const addInventoryItemMutation = `mutation AddInventoryItem($product: String!, $warehouse: String!, $stock: Float!) {
  addInventoryItem(Product: $product, Warehouse: $warehouse, stock: $stock) {
    _id
  }
}`

