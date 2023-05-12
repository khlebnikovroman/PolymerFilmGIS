import React, {FunctionComponent, useEffect, useState} from 'react';
import {Form, FormInstance, Input, Transfer} from "antd";
import {IGetLayerDto, ObjectOnMapDetailsDto, ObjectsOnMapClient} from "../../../services/Clients";

interface OwnProps {
    layerDto: IGetLayerDto
    form: FormInstance
}

type Props = OwnProps;

const EditLayerForm: FunctionComponent<Props> = (props) => {

    const [objectOnMapDtos, setObjectOnMapDtos] = useState<ObjectOnMapDetailsDto[]>([]);
    const [objectsOnThisLayer, setObjectsOnThisLayer] = useState<ObjectOnMapDetailsDto[]>([]);
    const [allobjects, setAllObjects] = useState<ObjectOnMapDetailsDto[]>([]);

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
