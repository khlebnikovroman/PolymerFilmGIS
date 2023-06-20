import React, {useState} from "react";
import {Checkbox, Form, FormInstance, InputNumber} from "antd";
import { GetUserSettingsDTO, UpdateUserSettingsDTO
} from "../../services/Clients";
import {CheckboxChangeEvent} from "antd/es/checkbox";


interface props {
    settings: GetUserSettingsDTO | UpdateUserSettingsDTO,
    form: FormInstance;
}

const UserSettingsForm: React.FC<props> = ({form, settings}: props) => {
    const [settingIsNeedToDrawHeatMap, setSettingIsNeedToDrawHeatMap] = useState<boolean>(settings.isNeedToDrawHeatMap!)
    const [settingRadius, setSettingRadius] = useState<number>(settings.radiusOfObjectWithMaxCapacityInKilometers!)


    const handleIsNeedToDrawHeatMap = ( e: CheckboxChangeEvent) => {
        setSettingIsNeedToDrawHeatMap(e.target.checked);
        console.log(form.getFieldValue('settingIsNeedToDrawHeatMap'));
    };

    const handleSettingRadius = (value: number | null) => {
        setSettingRadius(Number(value));
    };

    return (
        <Form
            form={form}
            labelCol={{span: 0}}
            wrapperCol={{span: 10}}
            style={{display: "flex", flexDirection: "column", flex: 1, alignItems: "stretch"}}
            initialValues={{
                settingIsNeedToDrawHeatMap: settings.isNeedToDrawHeatMap,
                settingRadius: settings.radiusOfObjectWithMaxCapacityInKilometers,
            }}
        >
            <Form.Item label="Отображать тепловую карту?"
                       name="settingIsNeedToDrawHeatMap"
                       valuePropName={'checked'}
            >
                <Checkbox style={{marginLeft: "10px"}} defaultChecked={settingIsNeedToDrawHeatMap} onChange={e => handleIsNeedToDrawHeatMap(e)} />
            </Form.Item>
            <Form.Item label="Установить радиус для объекта с максимальной мощностью в км"
                       name="settingRadius"
                       rules={[{
                           required: true,
                           message: 'Пожалуйста, установите радиус для объекта с максимальной мощностью'
                       }]}
            >
                <InputNumber style={{marginLeft: "10px"}} min={0.1} step={0.1} value={settingRadius} onChange={handleSettingRadius} />
            </Form.Item>
        </Form>
    )
}
export default UserSettingsForm