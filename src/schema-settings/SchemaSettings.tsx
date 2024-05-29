import { Designable, FormDialog, SchemaComponent } from "../schema-component";
import { Field, GeneralField, createForm } from '@formily/core';
import { ISchema, Schema, SchemaOptionsContext, useField, useFieldSchema, useForm } from '@formily/react';
import { ConfigProvider, Dropdown, DropdownProps, MenuProps } from "antd";
import { css } from '@emotion/css';
import { ReactNode, useCallback, useState, useTransition as useReactTransition, PropsWithChildren, createContext, useContext, FC, } from "react";
import { useCollectMenuItem, useCollectMenuItems, useMenuItem } from "../hooks";
import { SchemaSettingsItemProps } from "../application/schema-settings/types";
import { omit } from "lodash-es";
import { useGlobalTheme } from "../css-variable/GlobalThemeContext";
import { DeclareVariable } from "../modules/variable/DeclareVariable";
import { useVariable } from "../modules/variable/useVariable";
import { FormActiveFieldsProvider, FormBlockContext, useFormActiveFields, useFormBlockContext } from "../block-provider";
import { isFunction } from 'lodash-es'
import { Router } from 'react-router-dom';
import { SchemaComponentOptions } from "../schema-component/SchemaComponentOptions";
import { ArrayCollapse, ArrayItems, FormItem, FormLayout, Input } from '@formily/antd-v5';
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

export interface SchemaSettingsModalItemProps {
    title: string;
    onSubmit: (values: any) => void;
    initialValues?: any;
    schema?: ISchema | (() => ISchema);
    modalTip?: string;
    components?: any;
    hidden?: boolean;
    scope?: any;
    effects?: any;
    width?: string | number;
    children?: ReactNode;
    asyncGetInitialValues?: () => Promise<any>;
    eventKey?: string;
    hide?: boolean;
    /** 上下文中不需要当前记录 */
    noRecord?: boolean;
}
export const SchemaSettingsModalItem: FC<SchemaSettingsModalItemProps> = (props) => {
    const {
        hidden,
        title,
        components,
        scope,
        effects,
        onSubmit,
        asyncGetInitialValues,
        initialValues,
        width = 'fit-content',
        noRecord = false,
        ...others
    } = props;
    const options = useContext(SchemaOptionsContext);



    const { theme } = useGlobalTheme();

    // const upLevelActiveFields = useFormActiveFields();
    const { locale } = useContext(ConfigProvider.ConfigContext);



    const formCtx = useFormBlockContext();



    // 解决变量`当前对象`值在弹窗中丢失的问题
    // const { formValue: subFormValue, collection: subFormCollection } = useSubFormValue();
    const upLevelActiveFields = useFormActiveFields();

    // 解决变量`$nPopupRecord`值在弹窗中丢失的问题
    const popupRecordVariable = useVariable('$nPopupRecord');

    if (hidden) {
        return null;
    }
    return (
        <SchemaSettingsItem
            title={title}
            {...others}
            onClick={async () => {
                const values = asyncGetInitialValues ? await asyncGetInitialValues() : initialValues;
                const schema = isFunction(props.schema) ? props.schema() : props.schema;
                FormDialog(
                    { title: schema.title || title, width },
                    () => {
                        return (
                            <DeclareVariable
                                name="$nPopupRecord"
                                title={popupRecordVariable.title}
                                value={popupRecordVariable.value}
                            >

                                <FormBlockContext.Provider value={formCtx}>
                                    <FormActiveFieldsProvider
                                        name="form"
                                        getActiveFieldsName={upLevelActiveFields?.getActiveFieldsName}
                                    >
                                        <Router location={location} navigator={null}>


                                            <SchemaComponentOptions scope={options.scope} components={options.components}>
                                                <FormLayout
                                                    layout={'vertical'}
                                                    className={css`
                                        // screen > 576px
                                        @media (min-width: 576px) {
                                          min-width: 520px;
                                        }

                                        // screen <= 576px
                                        @media (max-width: 576px) {
                                          min-width: 320px;
                                        }
                                      `}
                                                >
                                                    <ConfigProvider locale={locale}>
                                                        <SchemaComponent components={components} scope={scope} schema={schema} />
                                                    </ConfigProvider>

                                                </FormLayout>
                                            </SchemaComponentOptions>
                                        </Router>
                                    </FormActiveFieldsProvider>
                                </FormBlockContext.Provider>
                            </DeclareVariable>

                        );
                    },
                    theme,
                )
                    .open({
                        initialValues: values,
                        effects,
                    })
                    .then((values) => {
                        onSubmit(values);
                        return values;
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }}
        >
            {props.children || props.title}
        </SchemaSettingsItem>
    );
};
