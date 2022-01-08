import 'reflect-metadata'
import { Arg, Args, Query, Resolver, Mutation } from "type-graphql";
import Warehouse from "./warehouse.schema";
import WarehouseService from "./warehouse.service";
import { WarehouseArgs, WarehouseNotFoundError, NewWarehouseInput, ModifyWarehouseInput } from "./warehouse.helpers";


@Resolver(Warehouse)
export default class WarehouseResolver {
    private warehouseService = new WarehouseService()

    @Query(() => Warehouse)
    async warehouse(@Arg("id") id: string): Promise<Warehouse | null> {
        const warehouse = await this.warehouseService.findById(id);
        if (!warehouse) {
            throw WarehouseNotFoundError(id);
        }
        return warehouse;
    }

    @Query(() => [Warehouse])
    async warehouses(@Args() { skip, limit }: WarehouseArgs): Promise<Warehouse[]> {
        return await this.warehouseService.findAll({ skip, limit });
    }

    @Mutation(() => Warehouse)
    async addWarehouse(@Args({ validate: true }) newProductData: NewWarehouseInput): Promise<Warehouse | Error> {
        return await this.warehouseService.addWarehouse(newProductData)
    }

    @Mutation(() => Boolean)
    async modifyWarehouse(@Args({ validate: true }) modifyProductData: ModifyWarehouseInput): Promise<Boolean | Error> {
        return await this.warehouseService.modifyWarehouse(modifyProductData)
    }

    @Mutation(() => Boolean)
    async deleteWarehouse(@Arg('id') id: string): Promise<Boolean> {
        return await this.warehouseService.deleteProduct(id)
    }
}