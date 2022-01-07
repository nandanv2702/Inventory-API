import { prop, Ref } from '@typegoose/typegoose'
import InventoryItem from '../inventoryItem/inventoryItem.schema'

export default class Product {
    @prop({ required: true, minlength: 5, maxlength: 200, lowercase: true })
    public name!: string

    @prop({ minlength: 5, maxlength: 150, lowercase: true })
    description?: string

    // price in cents
    @prop({ required: true, min: 1 })
    unitPrice!: number

    @prop({ ref: () => InventoryItem })
    public InventoryItems?: Ref<InventoryItem>[]; 
}