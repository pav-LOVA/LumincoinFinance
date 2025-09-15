export type CategoriesResponseType = {
    error?: boolean;
    message?: string;
    response?: CategoryType[] | null;
}

export type CategoryType = {
    id: number,
    title: string,
}