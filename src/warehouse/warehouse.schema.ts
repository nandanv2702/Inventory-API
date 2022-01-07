import { prop, Ref } from '@typegoose/typegoose'
import { ObjectId } from 'mongoose';
import { Field } from 'type-graphql';
import InventoryItem from '../inventoryItem/inventoryItem.schema'

export default class Warehouse {
    @Field()
    readonly _id: ObjectId;

    @Field()
    @prop({ required: true, minlength: 5, maxlength: 200, lowercase: true })
    public name!: string

    @Field()
    @prop({ minlength: 5, maxlength: 50, lowercase: true })
    public streetAddress!: string

    // validate zipcode regex
    // from https://howtodoinjava.com/java/regex/us-postal-zip-code-validation/
    @Field(_type => Number)
    @prop({ minlength: 5, maxlength: 9, match: /^[0-9]{5}(?:-[0-9]{4})?$/ })
    public zipCode: number

    @Field(_type => [InventoryItem])
    @prop({ ref: () => InventoryItem })
    public InventoryItems?: Ref<InventoryItem>[];
}