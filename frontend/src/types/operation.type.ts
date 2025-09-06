export type OperationType = {
    type: "income" | "expense";
    amount: number;
    category?: string;
};