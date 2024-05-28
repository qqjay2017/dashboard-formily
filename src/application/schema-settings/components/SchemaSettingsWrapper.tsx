import { FC, useMemo } from "react";
import { SchemaSettingOptions } from "../types";
import { SchemaSettingsIcon } from './SchemaSettingsIcon';
import { useDesignable } from "../../../schema-component";
import { useField, useFieldSchema } from "@formily/react";
import { SchemaSettingsDropdown } from "../../../schema-settings";
import React from "react";
import { SchemaSettingsChildren } from "./SchemaSettingsChildren";


export const SchemaSettingsWrapper: FC<SchemaSettingOptions<any>> = (props) => {
    const { items, Component = SchemaSettingsIcon, name, componentProps, style, ...others } = props;
    const { dn } = useDesignable();
    const field = useField();
    const fieldSchema = useFieldSchema();
    const cProps = useMemo(
        () => ({
            options: props,
            style,
            ...componentProps,
        }),
        [componentProps, props, style],
    );
    return (
        <SchemaSettingsDropdown
            title={React.createElement(Component, cProps)}
            dn={dn}
            field={field}
            fieldSchema={fieldSchema}
            {...others}
        >
            <SchemaSettingsChildren>{items}</SchemaSettingsChildren>
        </SchemaSettingsDropdown>
    );
};