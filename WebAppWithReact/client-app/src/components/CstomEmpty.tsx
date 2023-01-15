import {Empty} from "antd";
import React from "react";

type CustomizeRenderEmptyProps = {
    description: string
}

const CustomizeRenderEmpty: React.FC<CustomizeRenderEmptyProps> = ({description}: CustomizeRenderEmptyProps) => (
    <Empty
        description={
            <span>{description}
      </span>
        }
    >
    </Empty>
);
export default CustomizeRenderEmpty