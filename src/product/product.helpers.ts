import { Length, Max, Min } from "class-validator";
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

export function ProductNotFoundError(id: string) {
    throw new Error(`Product with id ${id} not found`)
}

@ArgsType()
export class NewProductInput {
    @Field()
    @Length(5, 100)
    name: string;
    
    @Field()
    @Length(5, 150)
    description: string;
    
    @Field()
    @Min(1)
    unitPrice: number;
}