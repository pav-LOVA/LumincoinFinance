import {CategoriesType} from "../types/categories.type";

export interface CategoryResponse {
    error?: boolean;
    message?: string;
    response?: CategoriesType[] | null;
}