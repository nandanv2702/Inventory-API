import { Length, Max, Min } from "class-validator";
import { ObjectId } from "mongoose";
import { ArgsType, Field } from "type-graphql"

@ArgsType()
export class ProductArgs {
    @Field()
    @Min(0)
    skip: number = 0;

    @Field()
    @Min(1)
    @Max(300)
    limit: number = 25;
}

export function ProductNotFoundError(identifier: string | ObjectId) {
    throw new Error(`Product with id/name ${identifier} not found`)
}

@ArgsType()
export class NewProductInput {
    @Field()
    @Length(5, 100)
    name: string;

    @Field()
    @Length(5, 150)
    description: string;

    /**
     * this is the unit price in cents
     */
    @Field()
    @Min(1)
    unitPrice: number;
}

@ArgsType()
export class ModifyProductInput {
    @Field(() => String)
    _id: ObjectId

    @Field()
    @Length(5, 150)
    description: string;

    @Field()
    @Min(1)
    unitPrice: number;
}