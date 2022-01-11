import { buildSchema } from 'type-graphql'
import ProductResolver from '../product/product.resolver'
import WarehouseResolver from '../warehouse/warehouse.resolver'
import InventoryItemResolver from '../inventoryItem/inventoryItem.resolver'

export const createSchema = () => buildSchema({
    resolvers: [ProductResolver, WarehouseResolver, InventoryItemResolver]
})