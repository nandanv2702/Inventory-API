import { prop, Ref } from '@typegoose/typegoose'
import InventoryItem from '../inventoryItem/inventoryItem.schema'

export default class Warehouse {
    @prop({ required: true, minlength: 5, maxlength: 200, lowercase: true })
    public name!: string

    @prop({ minlength: 5, maxlength: 50, lowercase: true })
    streetAddress!: string

    // validate zipcode regex
    // from https://howtodoinjava.com/java/regex/us-postal-zip-code-validation/
    @prop({ minlength: 5, maxlength: 9, match: /^[0-9]{5}(?:-[0-9]{4})?$/ })
    zipCode: number

    @prop({ ref: () => InventoryItem })
    public InventoryItems?: Ref<InventoryItem>[];
}