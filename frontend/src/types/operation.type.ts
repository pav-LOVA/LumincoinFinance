import {Category} from "./category-type.type";

export type OperationType = {
    type: Category.income | Category.expense;
    amount: number;
    category?: string;
};