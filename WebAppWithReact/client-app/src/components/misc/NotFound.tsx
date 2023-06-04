import React from 'react';
import {Button, Result} from 'antd';
import {useNavigate} from "react-router-dom";

const NotFound: React.FC = () => {
    const navigate = useNavigate()

    function toHome() {
        navigate("/")
    }

    return (
        <Result
            status="404"
            title="404"
            subTitle="Запрашиваемая страница не найдена"
            extra={<Button type="primary" onClick={toHome}>На главную</Button>}
        />
    )
};

export default NotFound;