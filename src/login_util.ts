import { AuthenticationState, LoginCredentials, LoginResponse } from "./Authentication";

const LOGIN_EXPIRATION_SECONDS = 3000;

export class LoginUtil {
    static saveCredsToLocalStorage(creds: LoginCredentials) {
        localStorage.setItem("access_token",creds.access_token);
        localStorage.setItem("refresh_token",creds.refresh_token);
        localStorage.setItem("username",creds.username);
        localStorage.setItem("logged_in_at",Date.now().toString());
    }
    
    static validateCredentialsExpiration(creds: LoginCredentials):LoginCredentials {
        const logged_in_at = creds.logged_in_at;
        console.log("Logged in at: " + logged_in_at);
        console.log("Now: " + Date.now());
        const diff = (Date.now() - logged_in_at) / 1000.0;
        if (diff > LOGIN_EXPIRATION_SECONDS) {
            console.log("VALIDATE EXPIRE FAILED");
            creds.logged_in = false;
            return creds;
        }
        return creds;
        
    }
    
    static getValidatedCredsFromLocal():LoginCredentials {
        const creds = LoginUtil.getCredsFromLocalStorage();
        return LoginUtil.validateCredentialsExpiration(creds);
    }
    
    static getCredsFromLocalStorage():LoginCredentials {
    
        //Used to set the initial credentials state from local storage.
        //If local storage doesn't contain valid credentials, a default credential
        //structure is returned.
    
        const username = localStorage.getItem("username");
        const access_token = localStorage.getItem("access_token");
        const refresh_token = localStorage.getItem("refresh_token");
        const logged_in_at = localStorage.getItem("logged_in_at");  
        
        let creds: LoginCredentials = {logged_in: false, username: "", access_token: "", refresh_token: "",logged_in_at: 0};    
        
        if (!username || !access_token || !refresh_token || !logged_in_at) {
          return creds;
        }   
        if (username === undefined || access_token === undefined || refresh_token == undefined || logged_in_at == undefined) {
          return creds;
        }
    
        const logged_in_at_num: number = +logged_in_at;
    
        creds.logged_in = true;
        creds.username = username;
        creds.access_token = access_token;
        creds.refresh_token = refresh_token;
        creds.logged_in_at = logged_in_at_num;
        return creds;
    
    }
    
    static localCredsToLoginState(): AuthenticationState {
        const validatedCreds = LoginUtil.getValidatedCredsFromLocal();
        return {
            logged_in: validatedCreds.logged_in,
            username: validatedCreds.username
        }
    }
    
    static logoutLocalStorage() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("logged_in_at");
        localStorage.removeItem("username");
    }
    
    static loginResponseToCredentials(cred_res: LoginResponse): LoginCredentials {
        let creds = {logged_in: false, username: "", access_token: "", refresh_token: "", logged_in_at: 0};
        if (!cred_res) {return creds;}
        if (!cred_res.username || !cred_res.access_token || !cred_res.refresh_token) {
            return creds;
        }
        creds.logged_in = true;
        creds.access_token = cred_res.access_token;
        creds.refresh_token = cred_res.refresh_token;
        creds.username = cred_res.username;
        creds.logged_in_at = Date.now();
        return creds;
    }
    
}

