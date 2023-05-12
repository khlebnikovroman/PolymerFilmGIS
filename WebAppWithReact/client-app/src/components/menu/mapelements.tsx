import {Space} from "antd";
import {UserMenu} from "./usermenu";
import MenuLayers from "./menuLayers/MenuLayers";
import ObjectsOnMapMenu from "../objectsOnMap/ObjectsOnMapMenu";

export const Mapelements: React.FC = () => {

    return (
        <>
            <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                <UserMenu/>
                <MenuLayers/>
                <ObjectsOnMapMenu/>
            </Space>
        </>
    )
}