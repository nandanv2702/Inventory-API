import 'reflect-metadata'
import { Arg, Args, Query, Resolver, Mutation } from "type-graphql";
import Product from "./product.schema";
import ProductService from "./product.service";
import { ProductArgs, ProductNotFoundError, NewProductInput, ModifyProductInput } from "./product.helpers";

@Resolver()
export default class ProductResolver {
    private productService = new ProductService()

    @Query(() => Product)
    async product(@Arg("id") id: string): Promise<Product | null> {
        const product = await this.productService.findById(id);
        if (!product) {
            throw ProductNotFoundError(id);
        }
        return product;
    }

    @Query(() => [Product])
    async products(@Args() { skip, limit }: ProductArgs): Promise<Product[]> {
        return await this.productService.findAll({ skip, limit });
    }

    @Mutation(() => Product)
    async addProduct(@Args({ validate: true }) newProductData: NewProductInput): Promise<Product | Error> {
        return await this.productService.addProduct(newProductData)
    }

    @Mutation(() => Boolean)
    async modifyProduct(@Args({ validate: true }) modifyProductData: ModifyProductInput): Promise<Boolean | Error> {
        return await this.productService.modifyProduct(modifyProductData)
    }

    @Mutation(() => Boolean)
    async deleteProduct(@Arg('id') id: string): Promise<Boolean> {
        return await this.productService.deleteProduct(id)
    }
}