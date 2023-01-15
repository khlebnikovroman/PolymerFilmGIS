import {Space} from "antd";
import {UserMenu} from "./usermenu";
import MenuLayers from "./menuLayers/MenuLayers";

export const Mapelements: React.FC = () => {

    return (
        <>
            <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                <UserMenu/>
                <MenuLayers/>
            </Space>
        </>
    )
}