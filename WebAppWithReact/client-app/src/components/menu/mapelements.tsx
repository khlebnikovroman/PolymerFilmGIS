import type {UploadFile, UploadProps} from 'antd';
import {Button, message, Space, Upload} from "antd";
import {UserMenu} from "./usermenu";
import MenuLayers from "./menuLayers/MenuLayers";
import ObjectsOnMapMenu from "./objectsOnMap/ObjectsOnMapMenu";
import {UploadOutlined} from "@ant-design/icons";
import ObjectMarker from "../markers/ObjectMarker";
import {GetObjectOnMapDto, ObjectsOnMapClient} from "../../services/Clients";
import {useEffect, useRef, useState} from "react";
import L from "leaflet";
import {MapContainer} from "react-leaflet";
import {UploadChangeParam} from "antd/es/upload";
import type { RcFile } from 'antd/es/upload/interface';
import {setObjects} from "../../redux/ObjectSlice";
import {setMarker} from "../../redux/AllObjectSlice";
import {useAppDispatch} from "../../redux/store";

export const Mapelements: React.FC<{ allObjects: GetObjectOnMapDto[] }> = ({ allObjects }) => {

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const dispatch = useAppDispatch();

    // @ts-ignore
    const mapRef = useRef<MapContainer>(null);

    const handleUploadFile = async () => {
        
        const file = fileList[0] as RcFile;
        setUploading(true);
        const objectsClient = new ObjectsOnMapClient();
        await objectsClient.uploadFile({ data: file, fileName: file.name || "file" })
            .then(async () => {
                setFileList([]);
                message.success('upload successfully.');
                allObjects = await objectsClient.objectsOnMapAll()
            })
            .catch(() => {
                message.error('upload failed.');
            })
            .finally(() => {
                setUploading(false);
            });
    };
    
    const props: UploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);

            return false;
        },
        fileList,
    };
    
    return (
        <>
            <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                <UserMenu/>
                <Upload {...props}>
                    <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
                <Button
                    type="primary"
                    onClick={handleUploadFile}
                    disabled={fileList.length === 0}
                    loading={uploading}
                    style={{ marginTop: 16 }}
                >
                    {uploading ? 'Uploading' : 'Start Upload'}
                </Button>
                <MenuLayers/>
                <ObjectsOnMapMenu/>
                <ObjectMarker allObjects={allObjects}  mapRef={mapRef} />
            </Space>
        </>
    )
}