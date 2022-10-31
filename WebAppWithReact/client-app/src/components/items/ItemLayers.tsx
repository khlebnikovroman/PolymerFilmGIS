import React from 'react';
import { Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
// import {Button} from "antd";

interface ItemLayersProps {
    name: string
    key: string
}

const ItemLayer = ({name, key}:ItemLayersProps) => {
    const onChange = (e: CheckboxChangeEvent) => {
        console.log(key);
        console.log(`checked = ${e.target.checked}`);
        console.log(`target name = ${e.target.id}`);
    };
    return (
        <div>
            {/*{name}*/}
            {/*<input type="checkbox" onClick={setModal}></input>*/}
            <Checkbox id={key} onChange={onChange}>{name} {key}</Checkbox>
        </div>
    );
};

export default ItemLayer;