import type {CategoryType} from "./category.type";

export type OperationType = {
    "id": number,
    "type": CategoryType,
    "amount": number,
    "date": Date,
    "comment": string,
    "category": string,
}