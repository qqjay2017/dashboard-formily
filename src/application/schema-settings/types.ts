import { MenuItemProps } from "antd";
import { ComponentType } from "react";
import { SchemaSettingsModalItemProps } from "../../schema-settings";

export interface SchemaSettingOptions<T = {}> {
    name: string;
    Component?: ComponentType<T>;
    componentProps?: T;
    items: SchemaSettingsItemType[];
    style?: React.CSSProperties;
}

interface SchemaSettingsItemCommon<T = {}> {
    /**
     * 渲染唯一标识
     */
    key?: string;
    name: string;
    sort?: number;
    useVisible?: () => boolean;
    children?: SchemaSettingsItemType[];
    useChildren?: () => SchemaSettingsItemType[];
    /**
     * @default true
     */
    hideIfNoChildren?: boolean;
    componentProps?: Omit<T, 'children'>;
    useComponentProps?: () => Omit<T, 'children'>;
}

export interface SchemaSettingItemComponentType<T = {}> extends SchemaSettingsItemCommon<T> {
    Component: string | ComponentType<T>;
}

export interface SchemaSettingsItemProps extends Omit<MenuItemProps, 'title'> {
    title: string;
}
export interface SchemaSettingItemItemType extends SchemaSettingsItemCommon<SchemaSettingsItemProps> {
    type: 'item';
}
export type SchemaSettingItemModalType = SchemaSettingsItemCommon<SchemaSettingsModalItemProps> & {
    type: 'modal';
};

export type SchemaSettingItemAllBuiltType =

    | SchemaSettingItemItemType
    | SchemaSettingItemModalType
    ;

export type SchemaSettingsItemType = SchemaSettingItemComponentType | SchemaSettingItemAllBuiltType;