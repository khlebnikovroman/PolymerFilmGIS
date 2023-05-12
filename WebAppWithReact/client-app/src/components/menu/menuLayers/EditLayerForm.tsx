import React, {FunctionComponent, useEffect, useState} from 'react';
import {Form, FormInstance, Input, Transfer} from "antd";
import {GetObjectOnMapDto, IGetLayerDto, ObjectsOnMapClient} from "../../../services/Clients";

interface OwnProps {
    layerDto: IGetLayerDto
    form: FormInstance
}

type Props = OwnProps;

const EditLayerForm: FunctionComponent<Props> = (props: OwnProps) => {

    const [objectOnMapDtos, setObjectOnMapDtos] = useState<GetObjectOnMapDto[]>([]);
    const [objectsOnThisLayer, setObjectsOnThisLayer] = useState<GetObjectOnMapDto[]>([]);
    const [allobjects, setAllObjects] = useState<GetObjectOnMapDto[]>([]);

    useEffect(() => {
        const objectsOnMapClient = new ObjectsOnMapClient();
        objectsOnMapClient.getAllWithoutLayer().then(res => {
            setObjectOnMapDtos(res);
        })

    })
    return (
        <>
            <Form
                form={props.form}
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                initialValues={{remember: true}}
            >
                <Form.Item label="Название слоя"
                           name="layerName"
                           rules={[{required: true, message: 'Пожалуйста, введите название слоя'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item label="Объекты"
                           name="layerObjects">
                    <Transfer

                    />
                </Form.Item>
            </Form>
        </>
    );
};

export default EditLayerForm;
