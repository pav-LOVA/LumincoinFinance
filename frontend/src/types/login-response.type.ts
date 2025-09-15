export interface LoginResponseType {
    error?: boolean;
    message?: string;
    response?: {
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
        user: {
            id: number;
            name: string;
            lastName: string;
        };
    } | null;
}