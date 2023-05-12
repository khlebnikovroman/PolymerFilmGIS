import React, {useState} from "react";
import {Form, Input, Modal} from "antd";
import {CreateObjectOnMapDto, ObjectsOnMapClient} from "../../services/Clients";

interface AddObjectOnMapProps {
    open: boolean;
    setShown: Function;
    position: { lat: number; lng: number } | null;
}

const CreateObjectOnMap: React.FC<AddObjectOnMapProps> = ({open, setShown, position}: AddObjectOnMapProps) => {

    const [isShown, setLoading] = useState(open);

    const handleOk = () => {
        form
            .validateFields()
            .then(async (values) => {
                form.resetFields();
                const model = new CreateObjectOnMapDto({
                    name: values.objectName,
                    lati: values.objectLat,
                    long: values.objectLng, capacity: 1
                });
                const objectClient = new ObjectsOnMapClient();
                await objectClient.objectsOnMapPOST(model)
                setShown(false);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        form.resetFields()
        setShown(false);
    };


    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const [form] = Form.useForm();
    return (
        <>
            <Modal title="Добавление нового объекта"
                   open={open}
                   okText="Добавить объект"
                   cancelText="Отмена"
                   onOk={handleOk}
                   onCancel={handleCancel}>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    initialValues={{objectLat: position?.lat, objectLng: position?.lng}}
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
            </Modal>
        </>
    )
}
export default CreateObjectOnMap