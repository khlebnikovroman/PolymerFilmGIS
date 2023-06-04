import {Navigate, useLocation} from "react-router-dom";
import React, {FC, useEffect, useState} from "react";
import UserService from "./services/UserService";
import {Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";

type requireAuthProps = {
    children: JSX.Element
}

export const RequireAuth: FC<requireAuthProps> = ({children}: requireAuthProps): any => {
    {
        const location = useLocation();
        const [isLoggedIn, setIsLoggedIn] = useState(false);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            async function checkAuth() {
                const isAuthenticated = await UserService.checkAuthenticatedAndTryRefreshToken();
                setIsLoggedIn(isAuthenticated);
                setIsLoading(false);
            }

            checkAuth();
        }, []);

        if (isLoading) {
            // Показываем загрузочный экран или спиннер, пока проверяется авторизация
            return (
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
                    <Spin indicator={<LoadingOutlined/>}/>
                </div>
            );
        }

        if (!isLoggedIn) {
            // Перенаправляем на страницу авторизации, если пользователь не авторизован
            return <Navigate to="/login" state={{from: location}}/>;
        }

        return children;
    }
}
