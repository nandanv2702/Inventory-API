import { getModelForClass } from "@typegoose/typegoose";
import InventoryItem from "./inventoryItem.schema";

export default getModelForClass(InventoryItem)