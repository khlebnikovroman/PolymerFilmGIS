import React, {FunctionComponent, useEffect, useState} from 'react';
import {Form, FormInstance, Input, Transfer} from "antd";
import {GetObjectOnMapDto, ICreateLayerDto, IGetLayerDto, ObjectsOnMapClient} from "../../../services/Clients";
import type { TransferDirection } from 'antd/es/transfer';


interface OwnProps {
    layerDto: IGetLayerDto | ICreateLayerDto
    form: FormInstance
}

type Props = OwnProps;

const LayerForm: FunctionComponent<Props> = (props: OwnProps) => {

    const [objectOnMapDtos, setObjectOnMapDtos] = useState<GetObjectOnMapDto[]>([]);
    const [objectsOnThisLayer, setObjectsOnThisLayer] = useState<GetObjectOnMapDto[]>([]);
    const [allobjects, setAllObjects] = useState<GetObjectOnMapDto[]>([]);
    
    
    useEffect(() => {
        const objectsOnMapClient = new ObjectsOnMapClient();
        objectsOnMapClient.getAllWithoutLayer().then(res => {
            setObjectOnMapDtos(res);
        })
    })

    interface RecordType {
        key: string;
        title: string;
        description: string;
    }
    
    const mockData: RecordType[] = Array.from(objectOnMapDtos).map((objectOnMap, i) => ({
        key: i.toString(),
        title: `${objectOnMap.name}`,
        description: `description of content${i + 1}`,
    }));

    const initialTargetKeys = mockData.filter((item) => Number(item.key) > 10).map((item) => item.key);
    const [targetKeys, setTargetKeys] = useState(initialTargetKeys);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

    const onChange = (nextTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
        console.log('targetKeys:', nextTargetKeys);
        console.log('direction:', direction);
        console.log('moveKeys:', moveKeys);
        setTargetKeys(nextTargetKeys);
        test();
    };

    const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
        console.log('sourceSelectedKeys:', sourceSelectedKeys);
        console.log('targetSelectedKeys:', targetSelectedKeys);
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    const onScroll = (direction: TransferDirection, e: React.SyntheticEvent<HTMLUListElement>) => {
        console.log('direction:', direction);
        console.log('target:', e.target);
    };
    
    const test = () => {
        const objectNames = mockData.filter((item) => targetKeys.includes(item.key));
        console.log("Obj names", objectNames);
    };
    
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
                    <Transfer dataSource={mockData}
                              titles={['Source', 'Target']}
                              targetKeys={targetKeys}
                              selectedKeys={selectedKeys}
                              onChange={onChange}
                              onSelectChange={onSelectChange}
                              onScroll={onScroll}
                              render={(item) => item.title}/>
                </Form.Item>
            </Form>
        </>
    );
};

export default LayerForm;
