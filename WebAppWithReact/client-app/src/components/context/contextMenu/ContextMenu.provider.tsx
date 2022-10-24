import {FC, PropsWithChildren, useCallback, useEffect, useState} from "react";
import {ContextMenu, ContextMenuItem} from "./ContextMenu.context";
import styles from './ContextMenu.module.css';


export  const ContextMenuProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
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
        <ContextMenu.Provider value ={{ setContextMenu }}>
            {!!position && (
                <ul className={styles.contextMenu}
                    style={{left: position[0], top: position[1]}}
                >
                    {contextMenuItems.map((item) =>
                        <li
                            key={item.name}
                            className={styles.contextMenuItem}
                            onClick={item.onClick}
                        >{item.name}</li>
                    )}
                </ul>
            )}
            {children}
        </ContextMenu.Provider>
    )
}