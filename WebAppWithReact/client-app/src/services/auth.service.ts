import axios from "axios";
import {LoginModel} from "./loginModel";

const API_URL = "https://localhost:44412/api/auth/";


class AuthService {
    login(loginModel: LoginModel) {
        const password = loginModel.password;
        const username = loginModel.username;
        return axios

            .post(API_URL + "login", {
                username, password
            })
            .then(response => {
                if (response.data.token) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
        console.log("выход")
    }

    register(username: string, email: string, password: string, firstname: string, secondname: string) {
        return axios.post(API_URL + "register", {
            username,
            email,
            password,
            firstname,
            secondname
        });
    }

    getCurrentUser() {
        const userStr = localStorage.getItem("user");
        if (userStr) return JSON.parse(userStr);

        return null;
    }
}

export default new AuthService();
