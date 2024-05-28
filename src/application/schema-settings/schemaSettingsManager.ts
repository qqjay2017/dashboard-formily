
import { SchemaSettings } from './SchemaSettings'

/**
 * 下拉配置汇总
 */
export const schemaSettingsManager = {
    "settings:root": new SchemaSettings({
        name: "settings:root",

        items: [{
            key: '1',
            type: 'item',
            name: 'itemitem',
            componentProps: {
                title: 'DEMO1',
                onClick() {
                    alert('DEMO1');
                },
            }
        }]
    })
}