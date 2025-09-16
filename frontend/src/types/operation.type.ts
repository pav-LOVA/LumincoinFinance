import type {Category} from "./category.type";

export type OperationType = {
    "id": number | string,
    "type": Category,
    "amount": number,
    "date": Date,
    "comment": string,
    "category": string,
}