import React, {useState} from "react";
import {Form, FormInstance, Input, Modal} from "antd";
import {CreateObjectOnMapDto, ObjectsOnMapClient, UpdateObjectOnMapDto} from "../../services/Clients";
import {Marker} from "react-leaflet";

interface AddObjectOnMapProps {
    objectDto: CreateObjectOnMapDto | UpdateObjectOnMapDto
    form: FormInstance
}

const ObjectOnMapForm: React.FC<AddObjectOnMapProps> = ({objectDto, form}: AddObjectOnMapProps) => {

    //const [isShown, setLoading] = useState(open);

    const handleOk = () => {
        form
            .validateFields()
            .then(async (values) => {
                form.resetFields();
                const model = new CreateObjectOnMapDto({
                    name: values.objectName,
                    lati: values.objectLat,
                    long: values.objectLng,
                    capacity: 1
                });
                const objectClient = new ObjectsOnMapClient();
                await objectClient.objectsOnMapPOST(model)
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        form.resetFields()
    };


    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    //const [form] = Form.useForm();
    return (
        <>
            <Form
                form={form}
                name="basic"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                initialValues={{objectLat: objectDto.lati, objectLng: objectDto.long}}
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
                    label="Долгота"
                    name="objectLat"
                    rules={[{required: true, message: 'Пожалуйста, введите долготу'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Широта"
                    name="objectLng"
                    rules={[{required: true, message: 'Пожалуйста, введите широту'}]}
                >
                    <Input/>
                </Form.Item>
            </Form>
        </>
    )
}
export default ObjectOnMapForm