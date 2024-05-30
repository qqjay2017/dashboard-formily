import React from "react";
import {
  SchemaSettingsModalItem,
  useSchemaSettings,
} from "../../../schema-settings";
import { ISchema } from "@formily/react";
import { ColorTypeSelect } from "./ColorTypeSelect";
import { IsDarkThemeSelect } from "./IsDarkThemeSelect";

export const StyleSettingModal = () => {
  const { dn } = useSchemaSettings();

  return (
    <SchemaSettingsModalItem
      title={"主题风格设置"}
      schema={
        {
          type: "object",
          title: "主题风格设置",
          properties: {
            themeProvider: {
              title: "主题颜色",
              type: "string",
              default: dn.getSchemaAttribute("x-component-props.themeProvider"),
              "x-decorator": "FormItem",
              "x-component": ColorTypeSelect,
              "x-compile-omitted": ["default"],
            },
            isDarkTheme: {
              title: "主题风格",
              type: "boolearn",
              default: dn.getSchemaAttribute("x-component-props.isDarkTheme"),
              "x-decorator": "FormItem",
              "x-component": IsDarkThemeSelect,
              "x-compile-omitted": ["default"],
            },
          },
        } as ISchema
      }
      onSubmit={(formValue) => {
        dn.deepMerge({
          "x-component-props": {
            ...formValue,
          },
        });
      }}
    />
  );
};
