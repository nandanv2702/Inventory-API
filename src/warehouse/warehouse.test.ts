import { setupConnection, closeDatabase, mongoserver } from '../../test-utils/setup'
import { gCall } from '../../test-utils/gCall'
import { MongoMemoryServer } from 'mongodb-memory-server';
import WarehouseService from './warehouse.service'

const warehouseDb = new WarehouseService()

let mongod: MongoMemoryServer
beforeAll(async () => {
    mongod = await mongoserver()
    await setupConnection(mongod)
});

afterAll(async () => {
    await closeDatabase(mongod)
});

describe('Warehouse Resolver', () => {
    it('should create a warehouse', async () => {
        const result = await gCall({
            source: addWarehouseMutation,
            variableValues: seedData
        })

        expect(result!.data).toBeDefined()
        expect(result!.data!.addWarehouse).toEqual(
            expect.objectContaining(seedData)
        )

        const dbCall = await warehouseDb.findById(result!.data!.addWarehouse._id)

        expect(dbCall).toBeDefined()
        expect(dbCall!.streetAddress).toEqual(seedData.streetAddress)
        expect(dbCall!.name).toEqual(seedData.name)
        expect(dbCall!.zipCode).toEqual(seedData.zipCode)
    })

    it('should not create a warehouse with duplicate name', async () => {
        const duplicate = await gCall({
            source: addWarehouseMutation,
            variableValues: seedData
        })

        expect(duplicate.data).toBeNull()
        expect(duplicate.errors).toBeDefined()

        const warehouses = await warehouseDb.findAll({ skip: 0, limit: 10 })

        expect(warehouses).toHaveLength(1)
    })

    it('should correctly modify information', async () => {
        const existingInfo = await warehouseDb.findByName(seedData.name)

        expect(existingInfo).toHaveProperty('_id')
        expect(existingInfo).toEqual(
            expect.objectContaining(seedData)
        )

        const modified = await gCall({
            source: modifyWarehouseMutation,
            variableValues: {
                "id": existingInfo!._id.toString(),
                "streetAddress": "other address",
                "zipCode": "53105"
            }
        })

        expect(modified).toHaveProperty('data.modifyWarehouse')
        expect(modified!.data!.modifyWarehouse).toBeTruthy()

        const modifiedRecord = await warehouseDb.findByName(seedData.name)

        expect(modifiedRecord).toEqual(
            expect.objectContaining({
                _id: existingInfo!._id,
                name: seedData.name,
                streetAddress: "other address",
                zipCode: "53105"
            })
        )
    })

    it('should not accept number for zipCode', async () => {
        const existingInfo = await warehouseDb.findByName(seedData.name)

        expect(existingInfo).toHaveProperty('_id')

        const modified = await gCall({
            source: modifyWarehouseMutation,
            variableValues: {
                "id": existingInfo!._id.toString(),
                "zipCode": 17103
            }
        })

        expect(modified.errors).toBeDefined()
    })

    it('should delete warehouse', async () => {
        const existingInfo = await warehouseDb.findByName(seedData.name)

        expect(existingInfo).toHaveProperty('_id')

        const deleted = await gCall({
            source: deleteWarehouseMutation,
            variableValues: {
                "deleteWarehouseId": existingInfo!._id.toString(),
            }
        })

        expect(deleted!.data!.deleteWarehouse).toBeTruthy()

        const doesExist = await warehouseDb.findByName(seedData.name)

        expect(doesExist).toBeNull()
    })
})

const seedData = {
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

const modifyWarehouseMutation = `mutation ModifyWarehouse($id: String!, $streetAddress: String!, $zipCode: String!) {
  modifyWarehouse(_id: $id, streetAddress: $streetAddress, zipCode: $zipCode)
}`

const deleteWarehouseMutation = `mutation DeleteWarehouse($deleteWarehouseId: String!) {
  deleteWarehouse(id: $deleteWarehouseId)
}`