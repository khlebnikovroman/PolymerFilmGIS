import {AuthClient, LoginModel} from "./Clients";

class UserService {

    logout() {
        localStorage.removeItem("user");
        console.log("выход")
    }

    getCurrentUser() {
        const userStr = localStorage.getItem("user");
        if (userStr) return JSON.parse(userStr);

        return null;
    }

    async login(model: LoginModel) {
        const authClient = new AuthClient()
        const response = await authClient.login(model)
        localStorage.setItem("user", JSON.stringify(response));
    }

}

export default new UserService();