import React, {FunctionComponent, useEffect, useState} from 'react';
import {Form, FormInstance, Input, Transfer} from "antd";
import {CreateLayerDto, GetLayerDto, GetObjectOnMapDto, ObjectsOnMapClient} from "../../../services/Clients";
import type {TransferDirection} from 'antd/es/transfer';


interface OwnProps {
    layerDto: GetLayerDto | CreateLayerDto
    form: FormInstance
}

type Props = OwnProps;

const LayerForm: FunctionComponent<Props> = (props: OwnProps) => {

    const [objectWithoutLayer, setObjectWithoutLayer] = useState<GetObjectOnMapDto[]>([]);
    const [objectsOnThisLayer, setObjectsOnThisLayer] = useState<GetObjectOnMapDto[]>([]);
    const [allobjects, setAllObjects] = useState<GetObjectOnMapDto[]>([]);
    const [targetKeys, setTargetKeys] = useState<string[]>();
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

    let initialObjectsOnThisLayer: GetObjectOnMapDto[] = []
    let initialObjectsWithoutLayer: GetObjectOnMapDto[] = []
    useEffect(() => {
        if (props.layerDto instanceof GetLayerDto) {
            if (props.layerDto.objects) {
                initialObjectsOnThisLayer = props.layerDto.objects
            }
        }
        const objectsOnMapClient = new ObjectsOnMapClient();
        objectsOnMapClient.getAllWithoutLayer()
            .then(res =>
                initialObjectsWithoutLayer = res
            )
    }, [])

    useEffect(() => {

        setObjectsOnThisLayer(initialObjectsOnThisLayer)
        setObjectWithoutLayer(initialObjectsWithoutLayer);

        setAllObjects([...initialObjectsOnThisLayer, ...initialObjectsWithoutLayer])
        const initialTargetKeys: string[] = initialObjectsOnThisLayer
            .filter((item) => item.id !== undefined)
            .map((item) => item.id as string);
        setTargetKeys(initialTargetKeys);
    }, [])


    const onChange = (nextTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
        console.log('targetKeys:', nextTargetKeys);
        console.log('direction:', direction);
        console.log('moveKeys:', moveKeys);
        setTargetKeys(nextTargetKeys);
        //test();
    };

    const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
        console.log('sourceSelectedKeys:', sourceSelectedKeys);
        console.log('targetSelectedKeys:', targetSelectedKeys);
        //setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    const onScroll = (direction: TransferDirection, e: React.SyntheticEvent<HTMLUListElement>) => {
        console.log('direction:', direction);
        console.log('target:', e.target);
    };

    // const test = () => {
    //     const objectNames = mockData.filter((item) => targetKeys.includes(item.key));
    //     console.log("Obj names", objectNames);
    // };

    return (
        <>
            <Form
                form={props.form}
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
            >
                <Form.Item label="Название слоя"
                           name="layerName"
                           rules={[{required: true, message: 'Пожалуйста, введите название слоя'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item label="Объекты"
                           name="layerObjects">
                    <Transfer dataSource={allobjects}
                              titles={['Объекты без заданного слоя', 'Объекты на слое']}
                              targetKeys={targetKeys}
                              selectedKeys={selectedKeys}
                              onChange={onChange}
                              onSelectChange={onSelectChange}
                              onScroll={onScroll}
                              render={(item) => item.name!}/>
                </Form.Item>
            </Form>
        </>
    );
};

export default LayerForm;
