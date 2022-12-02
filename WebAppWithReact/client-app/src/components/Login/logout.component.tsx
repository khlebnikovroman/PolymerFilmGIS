import React from "react";
import AuthService from "../../services/auth.service";
import {useNavigate} from "react-router-dom";

export const LogoutComponent: React.FC = () => {
    const navigate = useNavigate();
    const navigateToHome = () => {
        AuthService.logout()
        navigate("/")
    }
        
    return (
        <div>
            <h1>ВЫХОД????????????</h1>
            <button onClick={navigateToHome}>ВЫХод</button>
        </div>
    )
}