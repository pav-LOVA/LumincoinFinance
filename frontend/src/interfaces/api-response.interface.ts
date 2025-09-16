import {OperationsType} from "../types/operations.type";

export interface ApiResponse {
    redirect?: string;
    error?: boolean;
    message?: string;
    response?: OperationsType[];
}