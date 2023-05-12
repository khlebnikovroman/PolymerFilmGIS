import {FC, PropsWithChildren, useCallback, useEffect, useState} from "react";
import {ContextMenu, ContextMenuItem} from "./ContextMenu.context";
import styles from './ContextMenu.module.css';
import {Menu} from "antd";
import MenuItem from "antd/lib/menu/MenuItem";


export const ContextMenuProvider: FC<PropsWithChildren<{}>> = ({children}) => {
    const [contextMenuItems, setContextMenuItems] = useState<ContextMenuItem[]>([]);
    const [position, setPosition] = useState<number[]>();

    const setContextMenu = useCallback((items: ContextMenuItem[], position: number[]) => {
        setContextMenuItems(items);
        setPosition(position);
    }, [])

    const closeMenu = useCallback(() => {
        setPosition(undefined);
    }, [])

    useEffect(() => {
        document.body.addEventListener('click', closeMenu);

        return () => {
            document.body.removeEventListener('click', closeMenu);
        }
    }, [closeMenu])

    return (
        <ContextMenu.Provider value={{setContextMenu}}>
            {!!position && (

                <Menu className={styles.contextMenu}
                      style={{left: position[0], top: position[1]}}
                >
                    {contextMenuItems.map((item) =>
                        <MenuItem
                            key={item.name}

                            onClick={item.onClick}
                        >{item.name}</MenuItem>
                    )}
                </Menu>
            )}
            {children}
        </ContextMenu.Provider>
    )
}