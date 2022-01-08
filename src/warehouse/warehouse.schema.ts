import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { ObjectId } from 'mongoose';
import { Field, ObjectType } from 'type-graphql';
import InventoryItem from '../inventoryItem/inventoryItem.schema'

@ObjectType()
export default class Warehouse {
    @Field(() => String)
    readonly _id: ObjectId;

    @Field()
    @prop({ required: true, minlength: 5, maxlength: 200, lowercase: true })
    public name!: string

    @Field()
    @prop({ minlength: 5, maxlength: 50, lowercase: true })
    public streetAddress!: string

    // validate zipcode regex
    // from https://howtodoinjava.com/java/regex/us-postal-zip-code-validation/
    @Field(() => String)
    @prop({ minlength: 5, maxlength: 9, match: /^[0-9]{5}(?:-[0-9]{4})?$/ })
    public zipCode: string

    @Field(() => [InventoryItem])
    @prop({ ref: 'InventoryItem' })
    public InventoryItems?: Ref<InventoryItem>[];
}

export const WarehouseModel = getModelForClass(Warehouse)