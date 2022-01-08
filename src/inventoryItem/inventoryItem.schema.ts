import { prop, Ref } from '@typegoose/typegoose'
import { ObjectId } from 'mongoose';
import Product from '../product/product.schema';
import Warehouse from '../warehouse/warehouse.schema'
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class InventoryItem {
    @Field(() => String)
    readonly _id: ObjectId;

    @Field(() => Product)
    @prop({ ref: 'Product', required: true })
    public Product!: Ref<Product>

    @Field(() => Warehouse)
    @prop({ ref: 'Warehouse', required: true })
    public Warehouse!: Ref<Warehouse>

    @Field(() => Number)
    @prop({ required: true, min: 0 })
    public stock!: number
}