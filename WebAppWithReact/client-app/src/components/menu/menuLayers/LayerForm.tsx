import React, {FunctionComponent, useEffect, useState} from 'react';
import {Form, FormInstance, Input, Transfer} from "antd";
import {CreateLayerDto, GetLayerDto, GetObjectOnMapDto, ObjectsOnMapClient} from "../../../services/Clients";
import type {TransferDirection} from 'antd/es/transfer';


interface OwnProps {
    layerDto: GetLayerDto | CreateLayerDto
    form: FormInstance
}

type Props = OwnProps;


interface RecordType {
    key: string;
    object: GetObjectOnMapDto
}

const LayerForm: FunctionComponent<Props> = (props: OwnProps) => {

    const [objectWithoutLayer, setObjectWithoutLayer] = useState<GetObjectOnMapDto[]>([]);
    const [objectsOnThisLayer, setObjectsOnThisLayer] = useState<GetObjectOnMapDto[]>([]);
    const [allobjects, setAllObjects] = useState<RecordType[]>([]);
    const [targetKeys, setTargetKeys] = useState<string[]>();
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);


    useEffect(() => {

        const objectsOnMapClient = new ObjectsOnMapClient();
        objectsOnMapClient.getAllWithoutLayer()
            .then(res => {
                    setObjectWithoutLayer(res)
                }
            )
        if (props.layerDto instanceof GetLayerDto) {
            if (props.layerDto.objects) {
                setObjectsOnThisLayer(props.layerDto.objects)
            }
        }
    }, [])
    useEffect(() => {

        setAllObjects([...objectsOnThisLayer, ...objectWithoutLayer].map(e => ({key: e.id!, object: e})))
    }, [objectsOnThisLayer, objectWithoutLayer])
    useEffect(() => {

        const initialTargetKeys: string[] = objectsOnThisLayer
            .filter((item) => item.id !== undefined)
            .map((item) => item.id as string);
        setTargetKeys(initialTargetKeys);
    }, [objectsOnThisLayer])

    const onChange = (nextTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
        switch (direction) {
            case "left":
                moveKeys.forEach(key => {
                    const layerObject = objectsOnThisLayer.find((item) => item.id === key)!;
                    setObjectWithoutLayer([...objectWithoutLayer, layerObject])
                    const newObjectsOnLayer = objectsOnThisLayer.filter(layer => layer.id !== key)
                    setObjectsOnThisLayer(newObjectsOnLayer)
                })
                break
            case "right":
                moveKeys.forEach(key => {
                    const layerObject = objectWithoutLayer.find((item) => item.id === key)!;
                    setObjectsOnThisLayer([...objectsOnThisLayer, layerObject])
                    const newObjectsWithoutLayer = objectWithoutLayer.filter(layer => layer.id !== key)
                    setObjectWithoutLayer(newObjectsWithoutLayer)
                })
                break
        }
        setTargetKeys(nextTargetKeys);
        //test();
    };

    const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    const onScroll = (direction: TransferDirection, e: React.SyntheticEvent<HTMLUListElement>) => {
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
                initialValues={{
                    layerName: props.layerDto.name,
                }}
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
                              render={(item) => item.object.name!}/>
                </Form.Item>
            </Form>
        </>
    );
};

export default LayerForm;
