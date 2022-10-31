import {createContext} from "react";

export interface MenuLayersItem {
    label: string;
    key: number;
    onChange: () => void;
}

interface MenuLayersModel {
    setMenuLayers: ( items: MenuLayersItem[] ) => void;
}

export const MenuLayers = createContext<MenuLayersModel>({
    setMenuLayers: () => {},
});