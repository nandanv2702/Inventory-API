import { getModelForClass } from "@typegoose/typegoose"
import Product from "./product.schema"

export default getModelForClass(Product)