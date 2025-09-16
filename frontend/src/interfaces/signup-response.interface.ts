export interface SignupResponse {
    error?: boolean;
    message?: string;
    response?: {
        user: {
            id: number;
            email: string;
            name: string;
            lastName: string;
        };
    } | null;
}