import React, {useEffect, useState} from "react";
import {Avatar, Card, Modal} from "antd";
import {LogoutOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import UserService from "../../services/UserService";
import Meta from "antd/es/card/Meta";
import {useNavigate} from "react-router-dom";

export const UserMenu: React.FC = () => {
    const [username, setusername] = useState("");
    const [open, setOpen] = useState(false)
    const navigate = useNavigate();
    useEffect(() => {
        setusername(UserService.getCurrentUserName()!)
    },);

    function logout() {
        UserService.logout();
        navigate("/login")
    }

    return (
        <>
            <Modal open={open}
                   onOk={logout}
                   onCancel={() => setOpen(false)}
                   title="Вы действительно хотите выйти?">

            </Modal>
            <Card hoverable style={{width: 300, marginTop: 16}}
                  actions={[
                      <SettingOutlined key="Настройки"/>,
                      <LogoutOutlined key="Выход" onClick={() => setOpen(true)}/>,
                  ]}>
                <Meta
                    avatar={<Avatar style={{backgroundColor: '#87d068'}} icon={<UserOutlined/>}/>}
                    title={username}
                />
            </Card>
        </>

    )
}