import {Category} from "./category.type";

export type OperationsType = {
    type: Category.income | Category.expense;
    amount: number;
    category?: string;
};