import { getModelForClass } from "@typegoose/typegoose";
import Warehouse from "./warehouse.schema";

export default getModelForClass(Warehouse)