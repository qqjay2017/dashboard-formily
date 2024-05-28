
import { AppMainProvider } from "../app-main/AppMainProvider"
import { baseDashboardRootSchema } from "../dashboard"
import { Hello } from "../dashboard/common/Hello"

import { SchemaComponent, SchemaComponentProvider, baseClassicFrameSchema, dashboardComponentMap } from "../schema-component"



const schema = {
    ...baseDashboardRootSchema,
    'x-component-props': {
        cols: 12,
        rows: 12,
        rowheight: 80,
        designWidth: 1920,
        designHeight: 1080,
        breakpoints: {
            showroom: 2600,
            desktop: 1300,
            tablet: 500,
            mobile: 0,
        },
        themeProvider: 'jfLightTheme',

    },
    properties: {
        a1: {
            ...baseClassicFrameSchema,

            'x-decorator-props': {
                w: 3,
                h: 1.75,
                x: 0,
                y: 0
            },
            properties: {
                a11: {
                    "x-settings": "settings:block",
                    'x-decorator': 'PositionDecorator',
                    _isJSONSchemaObject: true,
                    type: 'void',
                    'x-component': 'Hello',
                    'x-decorator-props': {
                        w: 1,
                        h: 1,
                        x: 0,
                        y: 0
                    },
                }
            }
        },
        a2: {
            ...baseClassicFrameSchema,
            "x-component-props": {
                title: "今日现场",
                extra: "Button",
                extraProps: {
                    type: 'primary'
                }
            },
            'x-decorator-props': {
                w: 3,
                h: 4.6,
                x: 0,
                y: 1.6
            },
            properties: {
                a21: {
                    "x-settings": "settings:block",
                    'x-decorator': 'PositionDecorator',
                    _isJSONSchemaObject: true,
                    type: 'void',
                    'x-component': 'Hello',
                    'x-decorator-props': {
                        w: 1,
                        h: 1,
                        x: 0,
                        y: 0
                    },
                }
            }
        },
        a3: {
            ...baseClassicFrameSchema,
            'x-decorator-props': {
                w: 3,
                h: 5.9,
                x: 0,
                y: 6.1
            },

        },


    },
}
console.log(dashboardComponentMap)
export const DashbaordSchemaEdit = () => {
    return (<AppMainProvider>
        <SchemaComponentProvider designable={true}>
            <SchemaComponent
                components={{
                    ...dashboardComponentMap,
                    Hello

                }}
                schema={schema}

            />
        </SchemaComponentProvider>
    </AppMainProvider>
    )
}
