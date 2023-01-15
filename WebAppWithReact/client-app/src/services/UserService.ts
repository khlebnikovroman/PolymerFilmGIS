import {AuthClient, LoginModel, LoginResponse} from "./Clients";
import * as jose from 'jose'

class UserService {

    logout() {
        localStorage.removeItem("user");
        console.log("выход")
    }

    getCurrentUserToken(): LoginResponse | null {
        const userStr = localStorage.getItem("user");
        if (userStr) return JSON.parse(userStr);

        return null;
    }

    getCurrentUserName(): string | null {
        const token = this.getCurrentUserToken()
        if (token != null) {

            const claims = jose.decodeJwt(token.token!)
            return (<string | null>claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"])
        }
        return null
    }

    async login(model: LoginModel) {
        const authClient = new AuthClient()
        const response = await authClient.login(model)
        localStorage.setItem("user", JSON.stringify(response));
    }

}

export default new UserService();