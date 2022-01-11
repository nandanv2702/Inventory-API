import { prop } from '@typegoose/typegoose'
import { ObjectId } from 'mongoose';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class Product {
    @Field(() => String)
    readonly _id: ObjectId;

    // in this case, the name uniquely identifies a product
    @Field()
    @prop({ required: true, minlength: 5, maxlength: 100, lowercase: true, unique: true })
    public name!: string

    @Field({ nullable: true })
    @prop({ minlength: 5, maxlength: 150, lowercase: true })
    public description?: string

    /**
     * this is the unit price in cents
     */
    @Field(() => Number, { nullable: true })
    @prop({ required: true, min: 1 })
    public unitPrice!: number
}