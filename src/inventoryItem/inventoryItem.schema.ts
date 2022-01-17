import { pre, prop, Ref } from '@typegoose/typegoose'
import { Types } from 'mongoose';
import Product from '../product/product.schema';
import Warehouse from '../warehouse/warehouse.schema'
import { Field, ObjectType } from 'type-graphql';
import ProductService from '../product/product.service';
import WarehouseService from '../warehouse/warehouse.service';
import { ValidationError } from 'apollo-server-express';
import { IsNotEmpty } from 'class-validator';

const productDb = new ProductService()
const warehouseDb = new WarehouseService()

@pre<InventoryItem>('save', async function () {
    const valid = await Promise.all([
        await productDb.findById(this.Product!._id.toString()),
        await warehouseDb.findById(this.Warehouse!._id.toString())
    ])

    const invalid = valid.filter((x) => x === null)

    if (invalid.length > 0) {
        throw new ValidationError('Product / Warehouse does not exist')
    }
})
@ObjectType()
export default class InventoryItem {
    @Field(() => String)
    readonly _id: Types.ObjectId;

    @Field(() => Product)
    @prop({ ref: 'Product', required: true })
    @IsNotEmpty()
    public Product!: Ref<Product>

    @Field(() => Warehouse)
    @prop({ ref: 'Warehouse', required: true })
    @IsNotEmpty()
    public Warehouse!: Ref<Warehouse>

    @Field(() => Number)
    @prop({ required: true, min: 0 })
    public stock!: number
}