import React from 'react'
import { SchemaSettingsModalItem, useSchemaSettings } from '../../../schema-settings';
import { ISchema } from '@formily/react';

export const StyleSettingModal = () => {
    const { dn } = useSchemaSettings();
    console.log(dn, 'dn')

    return (
        <SchemaSettingsModalItem

            title={'主题风格设置'}
            schema={
                {
                    type: 'object',
                    title: '主题风格设置',
                    properties: {
                        colorType: {
                            title: '主题颜色',
                            type: 'string',
                            default: dn.getSchemaAttribute('x-compoennts-props.colorType'),
                            'x-decorator': 'FormItem',
                            'x-component': 'Input',
                            'x-compile-omitted': ['default'],
                        },
                    },
                } as ISchema
            }
            onSubmit={({ colorType }) => {
                console.log(colorType, 'colorType')
                dn.deepMerge({
                    'x-compoennts-props': {
                        colorType,
                    },
                });
            }}
        />
    )
}
