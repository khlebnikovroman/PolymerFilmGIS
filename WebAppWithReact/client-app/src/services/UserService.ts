import {AuthClient, LoginModel, LoginResponse, RefreshTokenModel, RefreshTokenResponse} from "./Clients";
import * as jose from 'jose'
import Cookies from "js-cookie";

class UserService {

    logout() {
        Cookies.remove("user")
    }

    isAuthenticated() {
        const user = this.getCurrentUserToken();
        if (user) {
            const expirationDate = new Date(user.expiration!);
            const currentDate = new Date();
            return expirationDate > currentDate;
        }
        return false;
    }

    async checkAuthenticatedAndTryRefreshToken() {
        if (this.isAuthenticated()) {
            return true;
        } else {
            const success = await this.refreshToken();
            if (!success) {
                this.logout();
            }
            return success;
        }
    }

    async refreshToken() {
        const user = this.getCurrentUserToken();

        if (user) {
            const client = new AuthClient()
            let response: RefreshTokenResponse
            try {
                response = await client.refreshToken(new RefreshTokenModel({
                    accessToken: user.token,
                    refreshToken: user.refreshToken
                }))
            } catch {
                this.logout()
                return false;
            }
            Cookies.set("user", encodeURIComponent(JSON.stringify(response)))
            return true;

        }

        return false;
    }

    getCurrentUserToken(): LoginResponse | null {
        const user = Cookies.get("user")
        if (user) {
            return JSON.parse(decodeURIComponent(user));
        }
        return null;
    }

    getCurrentUserName(): string | null {
        const token = this.getCurrentUserToken();
        if (token != null) {
            const claims = jose.decodeJwt(token.token!);
            return <string | null>claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        }
        return null;
    }

    getCurrentUserId(): string | null {
        const token = this.getCurrentUserToken();
        if (token != null) {
            const claims = jose.decodeJwt(token.token!);
            return <string | null>claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/id"];
        }
        return null;
    }

    async login(model: LoginModel) {
        const authClient = new AuthClient();
        const response = await authClient.login(model);
        Cookies.set("user", encodeURIComponent(JSON.stringify(response)))
    }


}

export default new UserService();