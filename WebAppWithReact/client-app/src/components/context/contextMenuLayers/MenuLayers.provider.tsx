import {FC, PropsWithChildren, useCallback, useEffect, useState} from "react";
import {MenuLayers, MenuLayersItem} from "./MenuLayers.context";
import styles from './MenuLayers.module.css';

export const MenuLayersProvider: FC<PropsWithChildren<{}>> = ({children}) => {
    const [menuLayersItems, setMenuLayersItems] = useState<MenuLayersItem[]>([]);
    
    const setMenuLayers = useCallback((items: MenuLayersItem[]) => {
        setMenuLayersItems(items);
    },[])

    const closeMenu = useCallback(() => {
        console.log(undefined);
    }, [])
    
    useEffect(() => {
        document.body.addEventListener('click', closeMenu);

        return () => {
            document.body.removeEventListener('click', closeMenu);
        }
    }, [closeMenu])
    
    return (
        <MenuLayers.Provider value={{setMenuLayers}}>
            <ul className={styles.menuLayers}>
                {menuLayersItems.map((item) =>
                    <li key={item.key}
                        onClick={item.onChange}
                        className={styles.menuLayersItem}
                    >{item.label}</li>
                )}
            </ul>
            {children}
        </MenuLayers.Provider>
    )
}