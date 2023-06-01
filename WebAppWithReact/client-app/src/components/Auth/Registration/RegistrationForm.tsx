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
                UserService.login(new LoginModel({username, password})).then(
                    () => {
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
               console.log(info);
               
            });
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
                        rules={[{required: true, message: 'Заполните обязательное поле'}]}
                    >
                        <Input.Password type={"password"} onChange={(e) => setPassword(e.target.value)}/>
                    </Form.Item>

                    <Form.Item wrapperCol={{offset: 8, span: 16}}>
                        <Button type="primary"  onClick={() => handleRegister()}>
                            Зарегистрироваться!
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default RegistrationForm;