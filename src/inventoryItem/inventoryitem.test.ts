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
        await setupProducts();
        await setupWarehouses();
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

    it('should not initialize with negative stock', async () => {
        const result = await gCall({
            source: addInventoryItemMutation,
            variableValues: {
                "product": productIds[0],
                "warehouse": warehouseIds[0],
                "stock": -100
            }
        });

        expect(result!.errors).toBeDefined()
        expect(result!.data).toBeNull()
    })

    it('should increment stock', async () => {
        const existingItem = await inventoryDb.findAll({ skip: 0, limit: 1 })

        const result = await gCall({
            source: updateStockMutation,
            variableValues: {
                "id": existingItem[0]._id.toString(),
                "changeStockBy": 50
            }
        });

        expect(result!.data!.updateStock).toBeTruthy()

        const checkItem = await inventoryDb.findById(existingItem[0]._id.toString())

        expect(checkItem.stock).toBe(existingItem[0].stock + 50)
    })

    it('should decrement stock', async () => {
        const existingItem = await inventoryDb.findAll({ skip: 0, limit: 1 })

        const result = await gCall({
            source: updateStockMutation,
            variableValues: {
                "id": existingItem[0]._id.toString(),
                "changeStockBy": -50
            }
        });

        expect(result!.data!.updateStock).toBeTruthy()

        const checkItem = await inventoryDb.findById(existingItem[0]._id.toString())

        expect(checkItem.stock).toBe(existingItem[0].stock - 50)
    })

    it('should not decrement stock below 0', async () => {
        const existingItem = await inventoryDb.findAll({ skip: 0, limit: 1 })

        const result = await gCall({
            source: updateStockMutation,
            variableValues: {
                "id": existingItem[0]._id.toString(),
                "changeStockBy": -existingItem[0].stock - 100
            }
        });

        expect(result!.data!.updateStock).toBeFalsy()

        const checkItem = await inventoryDb.findById(existingItem[0]._id.toString())

        expect(checkItem.stock).toBe(existingItem[0].stock)
    })

    it('should set stock to desired value', async () => {
        const existingItem = await inventoryDb.findAll({ skip: 0, limit: 1 })

        const result = await gCall({
            source: setStockMutation,
            variableValues: {
                "id": existingItem[0]._id.toString(),
                "stock": 9000
            }
        });

        expect(result).toHaveProperty('data.setStock')
        expect(result!.data!.setStock).toBeTruthy()

        const modifiedItem = await inventoryDb.findById(existingItem[0]._id.toString())

        expect(modifiedItem.stock).toEqual(9000)
    })
})

const productData = {
    "name": "test product",
    "description": "test description",
    "unitPrice": 6000
}

const otherProductData = {
    "name": "test product 2",
    "description": "test description 2",
    "unitPrice": 5000
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

const otherWarehouseData = {
    "name": "test warehouse 2",
    "streetAddress": "1234 other street",
    "zipCode": "17444"
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

async function setupProducts() {
    const rawResults =
        [
            await gCall({
                source: addProductMutation,
                variableValues: productData
            }),
            await gCall({
                source: addProductMutation,
                variableValues: otherProductData
            })
        ]

    const results = await Promise.all(rawResults)

    results.forEach((result) => {
        expect(result).toHaveProperty('data.addProduct._id')

        console.log(`ID is ${result!.data!.addProduct._id}`);

        productIds.push(result!.data!.addProduct._id);
    })
}

async function setupWarehouses() {
    const rawResults =
        [
            await gCall({
                source: addWarehouseMutation,
                variableValues: warehouseData
            }),
            await gCall({
                source: addWarehouseMutation,
                variableValues: otherWarehouseData
            })
        ]

    const results = await Promise.all(rawResults)

    results.forEach((result) => {
        expect(result).toHaveProperty('data.addWarehouse._id')

        warehouseIds.push(result!.data!.addWarehouse._id);
    })

}

const addInventoryItemMutation = `mutation AddInventoryItem($product: String!, $warehouse: String!, $stock: Float!) {
  addInventoryItem(Product: $product, Warehouse: $warehouse, stock: $stock) {
    _id
  }
}`

const updateStockMutation = `mutation UpdateStock($id: String!, $changeStockBy: Float!) {
  updateStock(_id: $id, changeStockBy: $changeStockBy)
}`

const setStockMutation = `mutation SetStock($id: String!, $stock: Float!) {
  setStock(_id: $id, stock: $stock)
}`

