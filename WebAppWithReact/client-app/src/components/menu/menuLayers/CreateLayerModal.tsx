import {Modal} from "antd";
import React, {useState} from "react";
import CreateLayerForm from "./CreateLayerForm";

type createLayerProps = {
    open: boolean
    setShown: Function
}

const CreateLayerModal: React.FC<createLayerProps> = ({open, setShown}: createLayerProps) => {


    const [isShown, setLoading] = useState(open);

    const handleOk = () => {
        setShown(false);
    };

    const handleCancel = () => {
        setShown(false);
    };

    return (
        <>
            <Modal title="Basic Modal" open={open} onOk={handleOk} onCancel={handleCancel}>
                <CreateLayerForm/>
            </Modal>
        </>
    )
}
export default CreateLayerModal
    
    