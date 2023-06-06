import {Button, Checkbox, Form, Input} from 'antd';
import React, {useState} from 'react';
import {AuthClient, ILoginModel, LoginModel, RegisterModel} from "../../../services/Clients";
import "../AuthStyles.css"
import UserService from "../../../services/UserService";
import {useLocation, useNavigate} from "react-router-dom";

const RegistrationForm: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [secondName, setSecondName] = useState("");
    const [isNotRegister, setNotRegister] = useState<boolean>(true);
    const [message, setMessage] = useState("");
    
    const navigation = useNavigate();
    const location = useLocation()
    const toPage = location.state?.from?.pathname || "/"
    
    const [form] = Form.useForm();
    
    const handleRegister = () => {
        form.validateFields()
            .then(async () => {
                const registrationModel = new RegisterModel({
                    username: username,
                    password: password,
                    email: email,
                    firstName: firstName,
                    secondName: secondName,
                });
                const authClient = new AuthClient();
                const response = await authClient.register(registrationModel); 
                if (response.status === 'Success') {
                    setNotRegister(false) 
                }
                UserService.login(new LoginModel({username, password}))
                    .then(() => {
                        navigation(toPage);
                    },
                    error => {
                        const resMessage =
                            (error.response &&
                                error.response.data &&
                                error.response.data.message) ||
                            error.message ||
                            error.toString();
                    }
                );
            })
            .catch((info) =>{
                setMessage("Логин занят!");
            });
    };

    const validatePassword = (_: any, value: string) => {
        if (!value) {
            return Promise.reject(new Error('Пожалуйста, введите пароль!'));
        }
        if (value.length < 6) {
            return Promise.reject(new Error('Пароль должен содержать минимум 6 символов.'));
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(value)) {
            return Promise.reject(
                new Error(
                    'Пароль должен содержать минимум 1 заглавную букву, 1 прописную букву, 1 цифру и 1 специальный символ.'
                )
            );
        }
        return Promise.resolve();
    };
    
    return (
        <div className={"containerStyle"}>
            <div className={"formStyle"}>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    initialValues={{remember: true}}
                    autoComplete="off"
                >

                    <Form.Item
                        label="Имя"
                        name="firstName"
                        rules={[{required: true, message: 'Заполните обязательное поле'}]}
                    >
                        <Input type={"text"} onChange={(e) => setFirstName(e.target.value)}/>
                    </Form.Item>
                    <Form.Item
                        label="Фамилия"
                        name="secondName"
                        rules={[{required: true, message: 'Заполните обязательное поле'}]}
                    >
                        <Input type={"text"} onChange={(e) => setSecondName(e.target.value)}/>
                    </Form.Item>
                    <Form.Item
                        label="Адрес электронной почты"
                        name="email"
                        rules={[{required: true, message: 'Заполните обязательное поле'}]}
                    >
                        <Input type={"email"} onChange={(e) => setEmail(e.target.value)}/>
                    </Form.Item>
                    <Form.Item
                        label="Логин"
                        name="username"
                        rules={[{required: true, message: 'Заполните обязательное поле'}]}
                    >
                        <Input type={"text"} onChange={(e) => setUsername(e.target.value)}/>
                    </Form.Item>
                    <Form.Item
                        label="Пароль"
                        name="password"
                        rules={[
                            {required: true, message: 'Заполните обязательное поле'},
                            { validator: validatePassword },
                        ]}
                        hasFeedback
                    >
                        <Input.Password type={"password"} onChange={(e) => setPassword(e.target.value)} onBlur={(e) => form.validateFields(['confirm'])}/>
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        label="Подтвердите пароль"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Пожалуйста, подтвердите пароль!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Пароли должны совпадать!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item wrapperCol={{offset: 8, span: 16}}>
                        <Button type="primary" onClick={() => handleRegister()} >
                            Зарегистрироваться
                        </Button>
                        <label style={{paddingLeft: "15px", color: "red"}}>{message}</label>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default RegistrationForm;