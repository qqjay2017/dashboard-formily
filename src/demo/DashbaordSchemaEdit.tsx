import { AppMainProvider } from "../app-main/AppMainProvider";
import { Application } from "../application";
import { DashboardRoot } from "../dashboard";
import { Hello } from "../dashboard/common/Hello";

import {
  ClassicFrame,
  SchemaComponent,
  SchemaComponentProvider,
  dashboardComponentMap,
} from "../schema-component";
import { HomeList } from "./HomeList";

const schema = {
  ...DashboardRoot.schema,
  "x-component-props": {
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
    themeProvider: "technologyBlue",
    isDarkTheme: false,
  },
  properties: {
    a1: {
      ...ClassicFrame.schema,

      "x-decorator-props": {
        w: 3,
        h: 1.75,
        x: 0,
        y: 0,
      },
      properties: {
        a11: {
          "x-settings": "settings:block",
          "x-decorator": "PositionDecorator",
          _isJSONSchemaObject: true,
          type: "void",
          "x-component": "Hello",
          "x-decorator-props": {
            w: 1,
            h: 1,
            x: 0,
            y: 0,
          },
        },
      },
    },
    a2: {
      ...ClassicFrame.schema,
      "x-component-props": {
        title: "今日现场",
        extra: "Button",
        extraProps: {
          type: "primary",
        },
      },
      "x-decorator-props": {
        w: 3,
        h: 4.6,
        x: 0,
        y: 1.6,
      },
      properties: {
        a21: {
          "x-settings": "settings:block",
          "x-decorator": "PositionDecorator",
          _isJSONSchemaObject: true,
          type: "void",
          "x-component": "Hello",
          "x-decorator-props": {
            w: 1,
            h: 1,
            x: 0,
            y: 0,
          },
        },
      },
    },
    a3: {
      ...ClassicFrame.schema,
      "x-decorator-props": {
        w: 3,
        h: 5.9,
        x: 0,
        y: 6.1,
      },
    },
  },
};

export const DashbaordSchemaEdit = () => {
  return (
    <AppMainProvider>
      <SchemaComponentProvider designable={true}>
        <SchemaComponent
          components={{
            ...(dashboardComponentMap as any),
            Hello,
          }}
          schema={schema}
        />
      </SchemaComponentProvider>
    </AppMainProvider>
  );
};

export const application = new Application({
  router: {
    type: "browser",
    routes: {
      home: {
        path: "/",
        Component: HomeList,
      },
    },
  },
});

export default application.getRootComponent();
