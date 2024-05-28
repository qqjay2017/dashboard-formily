import { Designable } from "../schema-component";
import { Field, GeneralField, createForm } from '@formily/core';
import { ISchema, Schema, SchemaOptionsContext, useField, useFieldSchema, useForm } from '@formily/react';
import { Dropdown, DropdownProps } from "antd";
import { css } from '@emotion/css';
import { ReactNode, useCallback, useState, useTransition as useReactTransition, } from "react";

export interface SchemaSettingsProps {
    title?: any;
    dn?: Designable;
    field?: GeneralField;
    fieldSchema?: Schema;
    children?: ReactNode;
}


export const SchemaSettingsDropdown: React.FC<SchemaSettingsProps> = (props) => {
    const { title, dn, ...others } = props;
    const [visible, setVisible] = useState(false);
    const [, startTransition] = useReactTransition();
    const changeMenu: DropdownProps['onOpenChange'] = useCallback((nextOpen: boolean, info) => {
        if (info.source === 'trigger' || nextOpen) {
            // 当鼠标快速滑过时，终止菜单的渲染，防止卡顿
            startTransition(() => {
                setVisible(nextOpen);
            });
        }
    }, []);
    const items = []

    return <Dropdown
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

}