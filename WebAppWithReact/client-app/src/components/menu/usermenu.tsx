import React, {useEffect, useState} from "react";
import {Avatar, Card} from "antd";
import {LogoutOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import UserService from "../../services/UserService";
import Meta from "antd/es/card/Meta";

export const UserMenu: React.FC = () => {
    const [username, setusername] = useState("");
    useEffect(() => {
        setusername(UserService.getCurrentUserName()!)
    },);
    return (
        <>
            {/*<Space.Compact block>*/}
            {/*    <Button>*/}
            {/*        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />*/}
            {/*        <h1>{username}</h1> */}
            {/*    </Button>*/}
            {/*    <Button type="primary">Button 1</Button>*/}
            {/*</Space.Compact>*/}
            <Card hoverable style={{width: 300, marginTop: 16}}
                  actions={[
                      <SettingOutlined key="Настройки"/>,
                      <LogoutOutlined key="Выход"/>,
                  ]}>
                <Meta
                    avatar={<Avatar style={{backgroundColor: '#87d068'}} icon={<UserOutlined/>}/>}
                    title={username}
                />
            </Card>
        </>

    )
}