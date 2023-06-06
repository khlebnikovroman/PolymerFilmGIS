import React, {useState} from "react";
import {Form, FormInstance, Input} from "antd";
import {CreateObjectOnMapDto, GetObjectOnMapDto} from "../../../services/Clients";

interface AddObjectOnMapProps {
    objectDto: CreateObjectOnMapDto | GetObjectOnMapDto
    form: FormInstance
}

const ObjectOnMapForm: React.FC<AddObjectOnMapProps> = ({objectDto, form}: AddObjectOnMapProps) => {
    const [objectName, setObjectName] = useState(objectDto.name || '');
    const [objectLat, setObjectLat] = useState(objectDto.lati || '');
    const [objectLng, setObjectLng] = useState(objectDto.long || '');
    const [objectCapacity, setObjectCapacity] = useState(objectDto.capacity || '');

    const handleObjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setObjectName(value);
        form.setFieldsValue({ objectName: value });
    };

    const handleObjectCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setObjectCapacity(value);
        form.setFieldsValue({ objectCapacity: value });
    };

    const handleObjectLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setObjectLat(value);
        form.setFieldsValue({ objectLat: value });
    };

    const handleObjectLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setObjectLng(value);
        form.setFieldsValue({ objectLng: value });
    };
    
    return (
        <>
            <Form
                form={form}
                name="basic"
                labelCol={{span: 4}}
                wrapperCol={{span: 25}}
                initialValues={{
                     objectName: objectDto.name,
                     objectLat: objectDto.lati,
                     objectLng: objectDto.long,
                     objectCapacity: objectDto.capacity
                }}
                autoComplete="off"
            >
                <Form.Item
                    name="objectName"
                    rules={[{required: true, message: 'Пожалуйста, введите название объекта'}]}
                >
                    <label>Название объекта</label>
                    <Input value={objectName} onChange={handleObjectNameChange} />
                </Form.Item>
                <Form.Item
                    name="objectCapacity"
                    rules={[{required: true, message: 'Пожалуйста, введите название объекта'}]}
                >
                    <label>Мощность</label>
                    <Input value={objectCapacity} onChange={handleObjectCapacityChange} />
                </Form.Item>
                <Form.Item
                    name="objectLat"
                    rules={[{required: true, message: 'Пожалуйста, введите широту'}]}
                >
                    <label>Широта</label>
                    <Input value={objectLat} onChange={handleObjectLatChange} />
                </Form.Item>
                <Form.Item
                    name="objectLng"
                    rules={[{required: true, message: 'Пожалуйста, введите долготу'}]}
                >
                    <label>Долгота</label>
                    <Input value={objectLng} onChange={handleObjectLngChange} />
                </Form.Item>
            </Form>
        </>
    )
}
export default ObjectOnMapForm