import {Button, Checkbox, Form, Input} from 'antd';
import React from 'react';

const RegistrationForm: React.FC = () => {
    
    return (
        <>
          <Form
              name="basic"
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              initialValues={{remember: true}}
              autoComplete="off"
          >
              <Form.Item
                  label="Имя пользователя!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
                  name="username"
                  rules={[{required: true, message: 'Введите имя пользователя'}]}
              >
                  <Input/>
              </Form.Item>

              <Form.Item
                  label="Пароль"
                  name="password"
                  rules={[{required: true, message: 'Введите пароль'}]}
              >
                  <Input.Password/>
              </Form.Item>

              <Form.Item name="remember" valuePropName="checked" wrapperCol={{offset: 8, span: 16}}>
                  <Checkbox>Запомнить меня</Checkbox>
              </Form.Item>

              <Form.Item wrapperCol={{offset: 8, span: 16}}>
                  <Button type="primary" htmlType="submit">
                      Вход
                  </Button>
                  <Button type="primary" onClick={RegistrationForm}></Button>
              </Form.Item>
          </Form>
        </>
    )
}

export default RegistrationForm;