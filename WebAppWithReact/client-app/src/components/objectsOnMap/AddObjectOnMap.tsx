import React, {useEffect, useState} from "react";
import {Button, Form, Input, Modal} from "antd";
import TextArea from "antd/es/input/TextArea";
import {CreateLayerDto, LayerClient} from "../../services/Clients";
import addObjectOnMap from "./AddObjectOnMap";

type AddObjectOnMapProps = {
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
        //const model = new CreateLayerDto()
        //model.name = values.layerName
        ////@ts-ignore
        //model.objects = checked
        //const layerClient = new LayerClient();
        //await layerClient.layerPOST(model)
        //console.log('Success:', values); 
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    
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
                        name="objectsCoords"
                    >
                        <p>Latitude: {position.lat}
                            Longitude: {position.lng}
                        </p>
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