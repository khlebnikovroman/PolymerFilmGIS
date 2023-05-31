import {FC, useEffect, useState} from "react";
import {Navigate, NavigateFunction, useLocation, useNavigate} from "react-router-dom";
import UserService from "../../../services/UserService";
import {ILoginModel, LoginModel} from "../../../services/Clients";
import RegistrationForm from "../Registration/RegistrationForm";
import {Button, Checkbox, Form, Input, Modal} from "antd";


type Props = {
    navigation: NavigateFunction,
    fromPage: string
};

type State = {
    isAuthorized: boolean,
    username: string,
    password: string,
    loading: boolean,
    message: string
};

const Login: FC = () => {
    const navigation = useNavigate();
    const location = useLocation()
    const fromPage = location.state?.from?.pathname || "/"
    
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const currentUser = UserService.getCurrentUserToken();
        if (currentUser) {
            setIsAuthorized(true);
        }
    }, []);

    const handleLogin = (values: any) => {
        setMessage("");
        setLoading(true);

        const loginModel = new LoginModel(new class implements ILoginModel {
            username = username;
            password = password
        });

        UserService.login(loginModel).then(
            () => {
                navigation(fromPage);
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setLoading(false);
                setMessage(resMessage);
            }
        );
    };
    const showRegistrationForm = () => {
        console.log("LOGGGG");
        return <RegistrationForm/>;
    };

    if (isAuthorized) {
        return <Navigate to={fromPage} />;
    }

    return (
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            autoComplete="off"
        >
            <Form.Item
                label="Имя пользователя"
                name="username"
                rules={[{ required: true, message: 'Введите имя пользователя' }]}
            >
                <Input onChange={(e) => setUsername(e.target.value)} />
            </Form.Item>

            <Form.Item
                label="Пароль"
                name="password"
                rules={[{ required: true, message: 'Введите пароль' }]}
            >
                <Input.Password onChange={(e) => setPassword(e.target.value)} />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                <Checkbox>Запомнить меня</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" onClick={() => handleLogin([])}>
                    Вход
                </Button>
                <Button type="primary" onClick={showRegistrationForm}>
                    Регистрация
                </Button>
            </Form.Item>
        </Form>
    );
}

export default Login