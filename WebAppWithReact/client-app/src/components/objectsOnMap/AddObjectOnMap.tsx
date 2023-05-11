import React, {useEffect, useState} from "react";
import {Button, Form, Input, Modal} from "antd";
import TextArea from "antd/es/input/TextArea";
import {CreateLayerDto, CreateObjectOnMapDto, LayerClient, ObjectsOnMapClient} from "../../services/Clients";
import addObjectOnMap from "./AddObjectOnMap";

interface AddObjectOnMapProps  {
    open: boolean;
    setShown: Function;
    position: { lat: number; lng: number } | null;
}

const CreateObjectOnMap: React.FC<AddObjectOnMapProps> = ({open, setShown, position}: AddObjectOnMapProps) => {
    
    const [isShown, setLoading] = useState(open);

    const handleOk = () => {
        setShown(false);
    };

    const handleCancel = () => {
        setShown(false);
    };

    const onFinish = async (values: any) => {
        const model = new CreateObjectOnMapDto()
        model.name = values.objectName
        model.lati = values.objectLat
        model.long = values.objectLng
        model.capacity = 100
        console.log('Success:', values);
        const objectClient = new ObjectsOnMapClient();
        await objectClient.objectsOnMapPOST(model)
        console.log('Success:', values); 
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    
    // @ts-ignore
    return (
        <>
            <Modal title="Basic Modal" open={open} onOk={handleOk} onCancel={handleCancel}>
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
                        label="Название объекта"
                        name="objectName"
                        rules={[{required: true, message: 'Пожалуйста, введите название объекта'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Координаты"
                        name="objectLat"
                        rules={[{required: true, message: 'Пожалуйста, введите название объекта'}]}
                    >
                        {position ? (
                            <>
                                <Input value={position.lat}/>
                            </>
                        ): (
                            <p>Position is not set</p>
                        )}
                    </Form.Item>
                    <Form.Item
                        name="objectLng"
                        rules={[{required: true, message: 'Пожалуйста, введите название объекта'}]}
                    >
                        {position ? (
                        <>
                            <Input value={position.lng}/>
                        </>
                        ): (
                        <p>Position is not set</p>
                        )}
                    </Form.Item>
                    <Form.Item wrapperCol={{offset: 8, span: 16}}>
                        <Button type="primary" htmlType="submit">
                            ОК
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
export default CreateObjectOnMap