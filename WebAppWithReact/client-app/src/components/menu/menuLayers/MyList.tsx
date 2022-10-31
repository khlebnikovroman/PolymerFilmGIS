import React, {useState} from "react";
import { Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import {Class} from "leaflet";

export declare interface ListProps<T> {
    label?: string
    key?: number
    dataSource?: T[];
    renderItem?: (item: T, index: number) => React.ReactNode;
    onChange?: () => void;
}

const onChange = (e: CheckboxChangeEvent) => {
    console.log(`checked = ${e.target.checked}`);
    console.log(`target name = ${e.target.id}`);
};

declare function ListT<T>({ label, key, dataSource, renderItem, onChange, ...rest }: ListProps<T>): JSX.Element;
declare namespace List {
    var Item: import("./Item").ListItemTypeProps;
}
export default ListT;
// const List = ({label, key, dataSource, renderItem, onChange}:ListProps<any>) => {
//    
//     return (
//         <div>
//             <Checkbox onChange={onChange}>{label}</Checkbox>
//         </div>
//     );
// };

