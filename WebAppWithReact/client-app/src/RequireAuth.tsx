import {Navigate, useLocation} from "react-router-dom";
import React, {FC} from "react";
import AuthService from "./services/auth.service";

type requireAuthProps = {
    children: JSX.Element
}

export const RequireAuth: FC<requireAuthProps> = ({children}: requireAuthProps): JSX.Element => {
    {
        const location = useLocation();
        const user = AuthService.getCurrentUser();
        console.log(user)
        if (!user) {
            return <Navigate to="/login" state={{from: location}}/>
        }
        return children;
    }
}
