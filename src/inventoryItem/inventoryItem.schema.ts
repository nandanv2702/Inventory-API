import { prop, Ref } from '@typegoose/typegoose'
import Product from 'src/product/product.schema'
import Warehouse from 'src/warehouse/warehouse.schema'

export default class InventoryItem {
    @prop({ ref: () => Product })
    public Product!: Ref<Product>

    @prop({ ref: () => Warehouse })
    public Warehouse!: Ref<Warehouse>

    @prop({ required: true, min: 0 })
    public stock!: number
}