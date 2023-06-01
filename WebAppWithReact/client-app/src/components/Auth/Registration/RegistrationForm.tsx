import {Button, Checkbox, Form, Input} from 'antd';
import React, {useState} from 'react';
import {AuthClient, ILoginModel, LoginModel, RegisterModel} from "../../../services/Clients";
import UserService from "../../../services/UserService";
import {ClientRequest} from "http";

const RegistrationForm: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [secondName, setSecondName] = useState("");
    
    const [form] = Form.useForm();
    
    const handleRegister = () => {
        form.validateFields()
            .then(async (values) => {
                const registrationModel = new RegisterModel({
                    username: username,
                    password: password,
                    email: email,
                    firstName: firstName,
                    secondName: secondName,
                });
                const authClient = new AuthClient();
                await authClient.register(registrationModel); 
            })
            .catch((info) =>{
               console.log(info); 
            });
    };
    
    return (
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
                  rules={[{required: true, message: 'Введите имя пользователя'}]}
              >
                  <Input onChange={(e) => setFirstName(e.target.value)}/>
              </Form.Item>
              <Form.Item
                  label="Фамилия"
                  name="secondName"
                  rules={[{required: true, message: 'Введите имя пользователя'}]}
              >
                  <Input onChange={(e) => setSecondName(e.target.value)}/>
              </Form.Item>
              <Form.Item
                  label="Адрес электронной почты"
                  name="email"
                  rules={[{required: true, message: 'Введите имя пользователя'}]}
              >
                  <Input onChange={(e) => setEmail(e.target.value)}/>
              </Form.Item>
              <Form.Item
                  label="Логин"
                  name="username"
                  rules={[{required: true, message: 'Введите имя пользователя'}]}
              >
                  <Input onChange={(e) => setUsername(e.target.value)}/>
              </Form.Item>
              <Form.Item
                  label="Пароль"
                  name="password"
                  rules={[{required: true, message: 'Введите пароль'}]}
              >
                  <Input.Password onChange={(e) => setPassword(e.target.value)}/>
              </Form.Item>

              <Form.Item wrapperCol={{offset: 8, span: 16}}>
                  <Button type="primary"  onClick={() => handleRegister()}>
                      Зарегистрироваться!
                  </Button>
              </Form.Item>
          </Form>
    )
}

export default RegistrationForm;