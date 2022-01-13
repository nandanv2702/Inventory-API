import { prop } from '@typegoose/typegoose'
import { ObjectId } from 'mongoose';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class Warehouse {
    @Field(() => String)
    readonly _id: ObjectId;

    @Field()
    @prop({ required: true, minlength: 5, maxlength: 200, lowercase: true, unique: true })
    public name!: string

    @Field()
    @prop({ minlength: 5, maxlength: 50, lowercase: true })
    public streetAddress!: string

    // validate zipcode regex
    // from https://howtodoinjava.com/java/regex/us-postal-zip-code-validation/
    @Field(() => String)
    @prop({ minlength: 5, maxlength: 9, match: /^[0-9]{5}(?:-[0-9]{4})?$/ })
    public zipCode: string
}