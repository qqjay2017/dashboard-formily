import { Schema } from "@formily/react";
import { SchemaSettingsProps } from "../../../schema-settings/SchemaSettings";
import { SchemaSettings } from "../SchemaSettings";
import { SchemaSettingOptions } from "../types";
import { GeneralField } from '@formily/core';
import { Designable } from "../../../schema-component";
import { useMemo } from "react";
import { schemaSettingsManager } from "../schemaSettingsManager";
import React from "react";
import { SchemaSettingsWrapper } from "../components";

type UseSchemaSettingsRenderOptions<T = {}> = Omit<SchemaSettingOptions<T>, 'name' | 'items'> &
    Omit<SchemaSettingsProps, 'title' | 'children'> & {
        fieldSchema?: Schema;
        field?: GeneralField;
        dn?: Designable;
    };


export function useSchemaSettingsRender<T = {}>(
    name: string | SchemaSettings<T>,
    options?: UseSchemaSettingsRenderOptions<T>,
) {
    // name   根据name匹配对应的下拉配置
    //最外层的配置 settings:root
    console.log(name, 'name')
    const schemaSetting: SchemaSettings = useMemo(
        () => (typeof name === 'object') ? name : schemaSettingsManager[name],
        [name],
    );
    if (!name || !schemaSetting) {
        console.error(`[大屏低代码]: SchemaSettings "${name}" not found`);
        return {
            exists: false,
            render: () => null,
        };
    }





    return {

        exists: true,
        render: (options2: UseSchemaSettingsRenderOptions = {}) => {
            return React.createElement(SchemaSettingsWrapper, {
                ...schemaSetting.options,
                ...options,
                ...options2,
            });
        },

    }

}