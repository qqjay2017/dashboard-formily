import { AppMainProvider } from "../app-main/AppMainProvider"
import { Hello } from "../dashboard/common/Hello"
import { SchemaComponent, SchemaComponentProvider, dashboardComponentMap } from "../schema-component"



const schema = {
    name: 'root',
    type: 'void',
    'x-component': 'DashboardRoot',

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
        themeProvider: 'jfLightTheme'

    },
    properties: {
        a1: {
            'x-uid': 'a1a1id',
            _isJSONSchemaObject: true,
            type: 'void',
            'x-component': 'Hello',
            "x-settings": "settings:block",
            'x-decorator': 'PositionDecorator',
            'x-decorator-props': {
                w: 3,
                h: 4,
                x: 2,
                y: 4
            },
            properties: {
                b1: {
                    'x-uid': 'b1a1id',
                    _isJSONSchemaObject: true,
                    type: 'void',
                    'x-component': 'Hello',
                    "x-settings": "settings:block",
                    'x-decorator': 'PositionDecorator',
                    'x-decorator-props': {
                        w: 1,
                        h: 1,
                        x: 0,
                        y: 0
                    },
                },
            }
        },
        a2: {
            'x-uid': 'a2a2d',
            _isJSONSchemaObject: true,

            type: 'void',
            'x-component': 'Hello',
            "x-settings": "settings:block",
            'x-decorator': 'PositionDecorator',
            'x-decorator-props': {
                w: 3,
                h: 3,
                x: 6,
                y: 8
            }

        },
        a3: {
            'x-uid': 'a3a3d',
            _isJSONSchemaObject: true,
            type: 'void',
            'x-component': 'Hello',
            "x-settings": "settings:block",
            'x-decorator': 'PositionDecorator',
            'x-decorator-props': {
                w: 2,
                h: 2,
                x: 4,
                y: 3
            },
            properties: {
                c1: {
                    'x-uid': 'ccc1a1id',
                    _isJSONSchemaObject: true,
                    type: 'void',
                    'x-component': 'Hello',
                    "x-settings": "settings:block",
                    'x-decorator': 'PositionDecorator',
                    'x-decorator-props': {
                        w: 1,
                        h: 1,
                        x: 0,
                        y: 0
                    },
                },
            }

        }
    },
}

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
