import React from "react";
import {Form, FormInstance, Input} from "antd";
import {CreateObjectOnMapDto, GetObjectOnMapDto} from "../../../services/Clients";

interface AddObjectOnMapProps {
    objectDto: CreateObjectOnMapDto | GetObjectOnMapDto
    form: FormInstance
}

const ObjectOnMapForm: React.FC<AddObjectOnMapProps> = ({objectDto, form}: AddObjectOnMapProps) => {
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
                    label="Название объекта"
                    name="objectName"
                    rules={[{required: true, message: 'Пожалуйста, введите название объекта'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Мощность"
                    name="objectCapacity"
                    rules={[{required: true, message: 'Пожалуйста, введите название объекта'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Широта"
                    name="objectLat"
                    rules={[{required: true, message: 'Пожалуйста, введите широту'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Долгота"
                    name="objectLng"
                    rules={[{required: true, message: 'Пожалуйста, введите долготу'}]}
                >
                    <Input/>
                </Form.Item>

            </Form>
        </>
    )
}
export default ObjectOnMapForm