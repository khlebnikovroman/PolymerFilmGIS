import React, {useEffect, useState} from "react";
import {Checkbox, ConfigProvider, Form, Input, List} from "antd";
import {CreateLayerDto, GetObjectOnMapDto, LayerClient, ObjectsOnMapClient} from "../../../services/Clients";
import {CheckboxValueType} from "antd/es/checkbox/Group";
import CustomizeRenderEmpty from "../../CustomEmpty";

const CreateLayerForm: React.FC = () => {

    const [checked, setChecked] = useState<CheckboxValueType[]>([]);
    const [objectOnMapDtos, setObjectOnMapDtos] = useState<GetObjectOnMapDto[]>([]);
    const [list, setList] = useState<GetObjectOnMapDto[]>([]);

    useEffect(() => {
        const objectsOnMapClient = new ObjectsOnMapClient();
        objectsOnMapClient.getAllWithoutLayer().then(res => {
            setObjectOnMapDtos(res);
            setList(res);
        })
    }, []);

    const onFinish = async (values: any) => {
        const model = new CreateLayerDto()
        model.name = values.layerName
        //@ts-ignore
        model.objects = checked
        const layerClient = new LayerClient();
        await layerClient.layerPOST(model)
        console.log('Success:', values); 
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const renderEmpty = () => (
        <CustomizeRenderEmpty description="Нет объектов..."/>
    );

    return (
        <>
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
                    label="Название слоя"
                    name="layerName"
                    rules={[{required: true, message: 'Пожалуйста, введите название слоя'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Объекты на слое"
                    name="layerName"
                >
                    <Checkbox.Group
                        value={checked}
                        onChange={(checkedValues) => {
                            console.log(checkedValues)
                            setChecked(checkedValues);
                        }}>
                        <ConfigProvider renderEmpty={renderEmpty}>
                            <List dataSource={list} renderItem={(item: GetObjectOnMapDto, index: number) =>
                                <List.Item style={{width: 256}}>
                                    <List.Item.Meta
                                        avatar={<Checkbox value={item.id}/>}
                                        title={item.name}
                                    />
                                </List.Item>}
                            />
                        </ConfigProvider>

                    </Checkbox.Group>


                </Form.Item>
                {/*<Form.Item wrapperCol={{offset: 8, span: 16}}>*/}
                {/*    <Button type="primary" htmlType="submit">*/}
                {/*        ОК*/}
                {/*    </Button>*/}
                {/*</Form.Item>*/}
            </Form>
        </>
    )
}
export default CreateLayerForm