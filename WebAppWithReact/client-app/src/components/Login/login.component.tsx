import { Component } from "react";
import { Navigate } from "react-router-dom";
import { Button, Checkbox, Form, Input } from 'antd';
import AuthService from "../../services/auth.service";

type Props = {};

type State = {
    redirect: string | null,
    username: string,
    password: string,
    loading: boolean,
    message: string
};

export default class Login extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);

        this.state = {
            redirect: null,
            username: "",
            password: "",
            loading: false,
            message: ""
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (currentUser) {
            this.setState({ redirect: "/profile" });
        };
    }

    componentWillUnmount() {
        window.location.reload();
    }

    // validationSchema() {
    //     return Yup.object().shape({
    //         username: Yup.string().required("This field is required!"),
    //         password: Yup.string().required("This field is required!"),
    //     });
    // }

    handleLogin(formValue: { username: string; password: string }) {
        const { username, password } = formValue;

        this.setState({
            message: "",
            loading: true
        });


        AuthService.login(username, password).then(
            () => {
                this.setState({
                    redirect: "/profile"
                });
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
        if (this.state.redirect) {
            return <Navigate to={this.state.redirect} />
        }

        const { loading, message } = this.state;

        const initialValues = {
            username: "",
            password: "",
        };

        return (
            <div>
                <div>
                    

                    
                        <Form>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <Input name="username" type="text" className="form-control" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <Input name="password" type="password" className="form-control" />
                            </div>

                            <div className="form-group">
                                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                    {loading && (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    )}
                                    <span>Login</span>
                                </button>
                            </div>

                            {message && (
                                <div className="form-group">
                                    <div className="alert alert-danger" role="alert">
                                        {message}
                                    </div>
                                </div>
                            )}
                        </Form>
                </div>
            </div>
        );
    }
}
