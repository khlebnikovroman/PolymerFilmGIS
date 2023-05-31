import React from "react";
import UserService from "../../../services/UserService";
import {useNavigate} from "react-router-dom";

export const LogoutComponent: React.FC = () => {
    const navigate = useNavigate();
    const navigateToHome = () => {
        UserService.logout()
        navigate("/")
    }

    return (
        <div>
            <h1>ВЫХОД????????????</h1>
            <button onClick={navigateToHome}>ВЫХод</button>
        </div>
    )
}