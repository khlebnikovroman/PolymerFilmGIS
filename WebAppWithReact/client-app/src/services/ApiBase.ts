import UserService from "./UserService";
import {AxiosRequestConfig} from "axios";

export class ApiBase {
    authToken: string | undefined = '';

    protected constructor() {
        this.setAuthToken(UserService.getCurrentUser()?.token)
    }

    setAuthToken(token: string | undefined) {
        this.authToken = token;
    }

    protected transformOptions(options: AxiosRequestConfig): Promise<AxiosRequestConfig> {
        // @ts-ignore
        options.headers["authorization"] = `Bearer ${this.authToken}`
        return Promise.resolve(options);
    }
}