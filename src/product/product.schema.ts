import { prop, Ref } from '@typegoose/typegoose'
import { ObjectId } from 'mongoose';
import { Field } from 'type-graphql';
import InventoryItem from '../inventoryItem/inventoryItem.schema'

export default class Product {
    @Field()
    readonly _id: ObjectId;
    
    @Field()
    @prop({ required: true, minlength: 5, maxlength: 200, lowercase: true })
    public name!: string

    @Field()
    @prop({ minlength: 5, maxlength: 150, lowercase: true })
    public description?: string

    // price in cents
    @Field(_type => Number)
    @prop({ required: true, min: 1 })
    public unitPrice!: number

    @Field(_type => [InventoryItem])
    @prop({ ref: () => InventoryItem })
    public InventoryItems?: Ref<InventoryItem>[]; 
}