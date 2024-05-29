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
                    title: 'Edit block title',
                    properties: {
                        title: {
                            title: 'Block title',
                            type: 'string',
                            default: dn.getSchemaAttribute('x-decorator-props.title'),
                            'x-decorator': 'FormItem',
                            'x-component': 'Input',
                            'x-compile-omitted': ['default'],
                        },
                    },
                } as ISchema
            }
            onSubmit={({ title }) => {
                dn.deepMerge({
                    'x-decorator-props': {
                        title,
                    },
                });
            }}
        />
    )
}
