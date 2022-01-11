import 'reflect-metadata'
import { Arg, Args, Query, Resolver, Mutation } from "type-graphql";
import InventoryItem from "./inventoryItem.schema";
import InventoryService from "./inventoryItem.service";
import { InventoryArgs, InventoryNotFoundError, NewInventoryInput, updateStockInput } from "./inventoryItem.helpers";

@Resolver()
export default class InventoryItemResolver {
    private inventoryService = new InventoryService()

    @Query(() => InventoryItem)
    async inventoryItem(@Arg("id") id: string): Promise<InventoryItem | null> {
        const product = await this.inventoryService
            .findById(id)

        console.log(product)

        if (!product) {
            throw InventoryNotFoundError(id);
        }
        return product;
    }

    @Query(() => [InventoryItem])
    async inventoryItems(@Args() { skip, limit }: InventoryArgs): Promise<InventoryItem[]> {
        return await this.inventoryService.findAll({ skip, limit });
    }

    @Mutation(() => InventoryItem)
    async addInventoryItem(@Args({ validate: true }) newProductData: NewInventoryInput): Promise<InventoryItem | Error> {
        return await this.inventoryService.addInventoryItem(newProductData)
    }

    @Mutation(() => Boolean)
    async updateStock(@Args({ validate: true }) updateInputs: updateStockInput): Promise<Boolean | Error> {
        return await this.inventoryService.updateStock(updateInputs)
    }
}