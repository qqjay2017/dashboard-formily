import { ComponentType } from "react";

export interface SchemaSettingOptions<T = {}> {
    name: string;
    Component?: ComponentType<T>;
    componentProps?: T;
    items: SchemaSettingsItemType[];
    style?: React.CSSProperties;
}


export type SchemaSettingsItemType = any;