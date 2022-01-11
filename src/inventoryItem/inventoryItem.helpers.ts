import { Max, Min } from "class-validator";
import { ObjectId } from "mongoose";
import { ArgsType, Field } from "type-graphql"

@ArgsType()
export class InventoryArgs {
    @Field()
    @Min(0)
    skip: number = 0;

    @Field()
    @Min(1)
    @Max(300)
    limit: number = 25;
}

export function InventoryNotFoundError(id: string) {
    throw new Error(`Inventory item with id ${id} not found`)
}

@ArgsType()
export class updateStockInput {
    @Field(() => String)
    _id: ObjectId

    @Field()
    changeStockBy?: number
}

@ArgsType()
export class setStockInput {
    @Field(() => String)
    _id: ObjectId

    @Field()
    stock?: number
}

@ArgsType()
export class NewInventoryInput {
    @Field(() => String)
    public Product!: ObjectId

    @Field(() => String)
    public Warehouse!: ObjectId

    @Field(() => Number)
    @Min(0)
    public stock!: number
}