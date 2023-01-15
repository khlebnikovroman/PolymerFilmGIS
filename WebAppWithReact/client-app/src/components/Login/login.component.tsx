import {Component, FC} from "react";
import {Navigate, NavigateFunction, useLocation, useNavigate} from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import {Button, Checkbox, Form, Input} from 'antd';
import {ILoginModel, LoginModel} from "../../services/Clients";
import UserService from "../../services/UserService";

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
export const Login2: FC = () => {
    const navigation = useNavigate();
    const location = useLocation()
    const fromPage = location.state?.from?.pathname || "/"
    return <Login navigation={navigation} fromPage={fromPage}/>
}

class Login extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        // const location = useLocation()
        this.state = {
            isAuthorized: false,
            username: "",
            password: "",
            loading: false,
            message: ""
        };
    }

    componentDidMount() {
        const currentUser = UserService.getCurrentUserToken();

        if (currentUser) {
            this.setState({isAuthorized: true});
        }
    }

    handleLogin(values: any) {
        const username = values.username;
        const password = values.password;
        console.log(username, password)
        this.setState({
            message: "",
            loading: true
        });

        const loginModel = new LoginModel(new class implements ILoginModel {
            username = username;
            password = password
        });
        //const authClient = new AuthClient();
        UserService.login(loginModel).then(
            () => {
                this.props.navigation(this.props.fromPage)
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                this.setState({
                    loading: false,
                    message: resMessage
                });
            }
        );
    }

    render() {
        if (this.state.isAuthorized) {
            return <Navigate to={this.props.fromPage}/>
        }

        const {loading, message} = this.state;

        const onFinish = (values: any) => {
            this.handleLogin(values)
            console.log('Success:', values); //todo delete
        };

        const onFinishFailed = (errorInfo: any) => {
            console.log('Failed:', errorInfo);
        };
        return (
            <Form
                name="basic"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{required: true, message: 'Please input your username!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true, message: 'Please input your password!'}]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked" wrapperCol={{offset: 8, span: 16}}>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export default Login2;