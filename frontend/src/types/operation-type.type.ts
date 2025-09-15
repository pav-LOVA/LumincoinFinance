import type {Category} from "./category-type.type";

export type OperationType = {
    "id": number,
    "type": Category,
    "amount": number,
    "date": Date,
    "comment": string,
    "category": string,
}