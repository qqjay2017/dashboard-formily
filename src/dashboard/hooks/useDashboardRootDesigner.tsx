import { useFieldSchema } from '@formily/react';
import React, { useMemo } from 'react'
import { SchemaToolbarProps } from '../types';
import { useSchemaSettingsRender } from '../../application/schema-settings/hooks/useSchemaSettingsRender';
import { useDesignable } from '../../schema-component';
import { SchemaToolbar } from '../GeneralDashboardRootSchemaDesigner';
import { useComponent } from './useComponent';
import { createStyles } from 'antd-style';
const DefaultSchemaToolbar = () => null;


const useInternalSchemaToolbarStyle = createStyles(({ css }) => {
    return css`
        position:absolute;
        right:12px;
        top:12px;
        z-index:999999;
    `
})

export const InternalSchemaToolbar = (props) => {
    const fieldSchema = useFieldSchema();
    const {
        title,
        settings,
    } = { ...props, ...(fieldSchema['x-toolbar-props'] || {}) } as SchemaToolbarProps;

    const { styles: internalSchemaToolbarStyles } = useInternalSchemaToolbarStyle()

    const { render: schemaSettingsRender, exists: schemaSettingsExists } = useSchemaSettingsRender(
        settings || fieldSchema['x-settings'],
        fieldSchema['x-settings-props'],
    );

    const settingsElement = useMemo(() => {

        return settings !== false && schemaSettingsExists ? schemaSettingsRender() : null;
    }, [schemaSettingsExists, schemaSettingsRender, settings]);



    return (<div className={internalSchemaToolbarStyles}>
        {settingsElement}
    </div>)
}



export const useDashboardRootDesigner = () => {
    const { designable } = useDesignable();
    const fieldSchema = useFieldSchema();
    const toolbar = useMemo(() => {
        if (fieldSchema['x-designer'] || fieldSchema['x-toolbar'])
            return fieldSchema['x-designer'] || fieldSchema['x-toolbar'];

        if (fieldSchema['x-settings']) {
            return SchemaToolbar;
        }
        return DefaultSchemaToolbar;
    }, [fieldSchema]);



    const component = useComponent(toolbar);
    return designable ? component || DefaultSchemaToolbar : DefaultSchemaToolbar;

}