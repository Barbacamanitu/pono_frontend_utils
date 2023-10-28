export type LoginCredentials = {
    access_token: string;
    refresh_token: string;
    username: string;
    logged_in_at: number;
    logged_in: boolean;
};
export type LoginResponse = {
    username: string;
    access_token: string;
    refresh_token: string;
};
export type AuthenticationState = {
    logged_in: boolean;
    username: string;
};
