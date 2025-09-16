import {OperationType} from "../types/operation.type";

export interface OperationResponse {
    error?: boolean;
    message?: string;
    response?: OperationType[] | null;
}