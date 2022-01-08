import { prop, Ref } from '@typegoose/typegoose'
import { ObjectId } from 'mongoose';
import Product from '../product/product.schema';
import Warehouse from '../warehouse/warehouse.schema'
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class InventoryItem {
    @Field(_type => String)
    readonly _id: ObjectId;
    
    @Field(_type => [Product])
    @prop({ ref: () => Product })
    public Product!: Ref<Product>

    @Field(_type => [Warehouse])
    @prop({ ref: () => Warehouse })
    public Warehouse!: Ref<Warehouse>

    @Field(_type => Number)
    @prop({ required: true, min: 0 })
    public stock!: number
}