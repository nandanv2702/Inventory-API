import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { ObjectId } from 'mongoose';
import { Field, ObjectType } from 'type-graphql';
import InventoryItem from '../inventoryItem/inventoryItem.schema'

@ObjectType()
export default class Product {
    @Field(() => String)
    readonly _id: ObjectId;
    
    @Field()
    @prop({ required: true, minlength: 5, maxlength: 100, lowercase: true })
    public name!: string

    @Field()
    @prop({ minlength: 5, maxlength: 150, lowercase: true })
    public description?: string

    // price in cents
    @Field(() => Number)
    @prop({ required: true, min: 1 })
    public unitPrice!: number

    @Field(() => [InventoryItem])
    @prop({ ref: () => InventoryItem })
    public InventoryItems?: Ref<InventoryItem>[];
}

export const ProductModel = getModelForClass(Product)