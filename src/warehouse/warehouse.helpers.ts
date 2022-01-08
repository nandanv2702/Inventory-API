import { Length, Max, Min } from "class-validator";
import { ObjectId } from "mongoose";
import { ArgsType, Field } from "type-graphql"

@ArgsType()
export class WarehouseArgs {
    @Field()
    @Min(0)
    skip: number = 0;

    @Field()
    @Min(1)
    @Max(300)
    limit: number = 25;
}

export function WarehouseNotFoundError(id: string) {
    throw new Error(`Warehouse with id ${id} not found`)
}

@ArgsType()
export class NewWarehouseInput {
    @Field()
    @Length(5, 100)
    name: string;

    @Field()
    @Length(5, 150)
    streetAddress: string;

    @Field()
    @Length(5, 9)
    zipCode: string;
}

@ArgsType()
export class ModifyWarehouseInput {
    @Field(() => String)
    _id: ObjectId

    @Field()
    @Length(5, 150)
    streetAddress: string;

    @Field()
    @Length(5, 9)
    zipCode: string;
}