
import { SchemaSettings } from './SchemaSettings'
import { StyleSettingModal } from './rootSettings/StyleSettingModal';

/**
 * 下拉配置汇总
 */
export const schemaSettingsManager = {
    "settings:root": new SchemaSettings({
        name: "settings:root",

        items: [
            {
                key: '1',
                type: 'item',
                name: 'itemitem',
                componentProps: {
                    title: 'DEMO1',
                    onClick() {
                        alert('DEMO1');
                    },
                }
            },
            {
                key: '2',
                name: '主题风格',
                Component: StyleSettingModal,
            }
        ]
    })
}