import { Designable } from "../schema-component";
import { Field, GeneralField, createForm } from '@formily/core';
import { ISchema, Schema, SchemaOptionsContext, useField, useFieldSchema, useForm } from '@formily/react';
import { Dropdown, DropdownProps, MenuProps } from "antd";
import { css } from '@emotion/css';
import { ReactNode, useCallback, useState, useTransition as useReactTransition, PropsWithChildren, createContext, useContext, FC, } from "react";
import { useCollectMenuItem, useCollectMenuItems, useMenuItem } from "../hooks";
import { SchemaSettingsItemProps } from "../application/schema-settings/types";
import { omit } from "lodash-es";

export interface SchemaSettingsProps {
    title?: any;
    dn?: Designable;
    field?: GeneralField;
    fieldSchema?: Schema;
    children?: ReactNode;
}

interface SchemaSettingsProviderProps extends PropsWithChildren {
    dn?: Designable;
    field?: GeneralField;
    fieldSchema?: Schema;
    setVisible?: any;
    visible?: any;
    template?: any;
    collectionName?: any;
    designer?: any;
}

interface SchemaSettingsContextProps<T = any> {
    dn?: Designable;
    field?: GeneralField;
    fieldSchema?: Schema;
    setVisible?: any;
    visible?: any;
    template?: any;
    collectionName?: any;
    designer?: T;
}


const SchemaSettingsContext = createContext<SchemaSettingsContextProps>(null);
SchemaSettingsContext.displayName = 'SchemaSettingsContext';

export function useSchemaSettings<T = any>() {
    return useContext(SchemaSettingsContext) as SchemaSettingsContextProps<T>;
}

export const SchemaSettingsProvider: React.FC<SchemaSettingsProviderProps> = (props) => {
    const { children, fieldSchema, ...others } = props;

    return (
        <SchemaSettingsContext.Provider value={{ collectionName: name, template: null, fieldSchema, ...others }}>
            {children}
        </SchemaSettingsContext.Provider>
    );
};


export const SchemaSettingsDropdown: React.FC<SchemaSettingsProps> = (props) => {
    const { title, dn, ...others } = props;
    const [visible, setVisible] = useState(false);
    const { Component, getMenuItems } = useMenuItem();

    const [, startTransition] = useReactTransition();
    const changeMenu: DropdownProps['onOpenChange'] = useCallback((nextOpen: boolean, info) => {
        if (info.source === 'trigger' || nextOpen) {
            // 当鼠标快速滑过时，终止菜单的渲染，防止卡顿
            startTransition(() => {
                setVisible(nextOpen);
            });
        }
    }, []);
    const items = getMenuItems(() => props.children);


    return <SchemaSettingsProvider visible={visible} setVisible={setVisible} dn={dn} {...others}>
        <Component />
        <Dropdown
            open={visible}
            onOpenChange={changeMenu}
            overlayClassName={css`
          .ant-dropdown-menu-item-group-list {
            max-height: 300px;
            overflow-y: auto;
          }
        `}
            menu={
                {
                    items,
                    'data-testid': 'schema-settings-menu',
                    style: { maxHeight: "80vh", overflowY: 'auto' },
                } as any
            }
        >
            <div data-testid={props['data-testid']}>{typeof title === 'string' ? <span>{title}</span> : title}</div>
        </Dropdown>
    </SchemaSettingsProvider>

}


export const SchemaSettingsItem: FC<SchemaSettingsItemProps> = (props) => {
    const { pushMenuItem } = useCollectMenuItems();
    const { collectMenuItem } = useCollectMenuItem();
    const { eventKey, title } = props;

    if (!title) {
        throw new Error('SchemaSettingsItem must have a title');
    }

    const item = {
        key: title,
        ...omit(props, ['children', 'name']),
        eventKey: eventKey as any,
        onClick: (info) => {
            info.domEvent.preventDefault();
            info.domEvent.stopPropagation();
            props?.onClick?.(info);
        },
        style: { minWidth: 120 },
        label: props.children || props.title,
        title: props.title,
    } as MenuProps['items'][0];

    pushMenuItem?.(item);
    collectMenuItem?.(item);
    return null;
};