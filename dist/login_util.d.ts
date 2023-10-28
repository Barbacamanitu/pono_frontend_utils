import { AuthenticationState, LoginCredentials, LoginResponse } from "./Authentication";
export declare class LoginUtil {
    static saveCredsToLocalStorage(creds: LoginCredentials): void;
    static validateCredentialsExpiration(creds: LoginCredentials): LoginCredentials;
    static getValidatedCredsFromLocal(): LoginCredentials;
    static getCredsFromLocalStorage(): LoginCredentials;
    static localCredsToLoginState(): AuthenticationState;
    static logoutLocalStorage(): void;
    static loginResponseToCredentials(cred_res: LoginResponse): LoginCredentials;
}
