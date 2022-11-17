import axios from "axios";

const API_URL = "http://localhost:44412/api/auth/";

class AuthService {
    login(username: string, password: string) {
        return axios
            .post(API_URL + "login", {
                username,
                password
            })
            .then(response => {
                if (response.data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
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
