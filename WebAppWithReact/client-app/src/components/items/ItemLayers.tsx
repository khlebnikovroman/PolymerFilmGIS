import React from 'react';
// import {Button} from "antd";

interface ItemLayersProps {
    name: string
    key: number
    setModal: () => void
}

const ItemLayers = ({name, key, setModal}:ItemLayersProps) => {
    
    return (
        <div >
            {name}
            <input type="checkbox" onClick={setModal}></input>
        </div>
    );
};

export default ItemLayers;