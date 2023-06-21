import React, {useEffect, useState} from "react";
import {Avatar, Card, Form, Modal} from "antd";
import {LogoutOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import UserService from "../../services/UserService";
import Meta from "antd/es/card/Meta";
import {useNavigate} from "react-router-dom";
import { GetUserSettingsDTO, UserClient} from "../../services/Clients";
import UserSettingsForm from "./UserSettingsForm";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../redux/store";
import {setSettings} from "../../redux/UserSettingsSlice";

export const UserMenu: React.FC = () => {
    const [username, setusername] = useState("");
    const [open, setOpen] = useState(false)
    const navigate = useNavigate();

    const {settings} = useSelector((state: RootState) => state.settings)
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        setusername(UserService.getCurrentUserName()!)
    },);

    function logout() {
        UserService.logout();
        navigate("/login")
    }

    const {confirm} = Modal;
    const [form] = Form.useForm();
    
    function showSettings() {
        form.setFieldsValue ({
            settingIsNeedToDrawHeatMap:  settings.isNeedToDrawHeatMap,
            settingRadius: settings.radiusOfObjectWithMaxCapacityInKilometers,
        });
        confirm({
            title: "Настройки",
            icon: <SettingOutlined/>,
            width: 700,
            okText: 'Применить',
            cancelText: 'Отмена',
            content: <UserSettingsForm form={form} settings={settings}/>,
            onOk: () => {
                form
                    .validateFields()
                    .then(async (values) => {
                        form.resetFields();
                        console.log(values.settingIsNeedToDrawHeatMap);
                        const model = new GetUserSettingsDTO({
                            isNeedToDrawHeatMap: values.settingIsNeedToDrawHeatMap,
                            radiusOfObjectWithMaxCapacityInKilometers: values.settingRadius,
                        });
                        const userSettings = new UserClient();
                        await userSettings.updateSettings(model);
                        dispatch(setSettings(model));
                    })
                    .catch((info) => {
                        form.resetFields();
                    });
            },
            onCancel: () => {
                form.resetFields()
            }
        })
    }
    // 
    return (
        <>
            <Modal open={open}
                   onOk={logout}
                   onCancel={() => setOpen(false)}
                   title="Вы действительно хотите выйти?">

            </Modal>
            <Card hoverable style={{width: "100%", marginTop: 16}}
                  actions={[
                      <SettingOutlined key="Настройки" onClick={() => showSettings()}/>,
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