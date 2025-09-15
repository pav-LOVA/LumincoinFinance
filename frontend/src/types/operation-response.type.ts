import {OperationType} from "./operation-type.type";

export type OperationResponseType = {
    error?: boolean;
    message?: string;
    response?: OperationType[] | null;
}