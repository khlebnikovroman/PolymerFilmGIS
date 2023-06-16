import type {UploadProps} from 'antd';
import {Button, message, Space, Upload} from "antd";
import {UserMenu} from "./usermenu";
import MenuLayers from "./menuLayers/MenuLayers";
import ObjectsOnMapMenu from "./objectsOnMap/ObjectsOnMapMenu";
import {UploadOutlined} from "@ant-design/icons";

export const Mapelements: React.FC = () => {

    const props: UploadProps = {
        name: 'file',
        action: '/api/ObjectsOnMap/UploadFile',
        method: 'post',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <>
            <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                <UserMenu/>
                <Upload {...props}>
                    <Button icon={<UploadOutlined/>}>Click to Upload</Button>
                </Upload>
                <MenuLayers/>
                <ObjectsOnMapMenu/>
            </Space>
        </>
    )
}