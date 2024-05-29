import { TinyColor } from "@ctrl/tinycolor";
import { PropsWithChildren, useEffect } from "react";

import defaultTheme from "./defaultTheme";
import { useToken } from "./useToken";

export const CSSVariableProvider = ({ children }: PropsWithChildren) => {
  const { token } = useToken();

  const colorBgScrollTrack = token.colorFillTertiary;
  const colorBgScrollBar = new TinyColor(token.colorFill)
    .onBackground(token.colorFillSecondary)
    .toHexShortString();
  const colorBgScrollBarHover = new TinyColor(token.colorFill)
    .onBackground(token.colorFill)
    .toHexShortString();
  const colorBgScrollBarActive = new TinyColor(token.colorFill)
    .onBackground(token.colorFill)
    .onBackground(token.colorFill)
    .toHexShortString();

  useEffect(() => {
    console.log(token.nodeContentBgColor, "nnn");
    document.body.style.setProperty("--nb-spacing", `${token.marginLG}px`);
    document.body.style.setProperty(
      "--nb-designer-offset",
      `${token.marginXS}px`
    );
    document.body.style.setProperty(
      "--nb-header-height",
      `${token.sizeXXL - 2}px`
    );
    document.body.style.setProperty("--nb-box-bg", token.colorBgLayout);
    document.body.style.setProperty("--nb-box-bg", token.colorBgLayout);
    document.body.style.setProperty(
      "--controlHeightLG",
      `${token.controlHeightLG}px`
    );
    document.body.style.setProperty(
      "--paddingContentVerticalSM",
      `${token.paddingContentVerticalSM}px`
    );
    document.body.style.setProperty("--marginSM", `${token.marginSM}px`);
    document.body.style.setProperty("--colorInfoBg", token.colorInfoBg);
    document.body.style.setProperty("--colorInfoBorder", token.colorInfoBorder);
    document.body.style.setProperty("--colorWarningBg", token.colorWarningBg);
    document.body.style.setProperty(
      "--colorWarningBorder",
      token.colorWarningBorder
    );
    document.body.style.setProperty("--colorText", token.colorText);
    document.body.style.setProperty(
      "--colorPrimaryText",
      token.colorPrimaryText
    );
    document.body.style.setProperty(
      "--colorPrimaryTextActive",
      token.colorPrimaryTextActive
    );
    document.body.style.setProperty(
      "--colorPrimaryTextHover",
      token.colorPrimaryTextHover
    );
    document.body.style.setProperty("--colorBgScrollTrack", colorBgScrollTrack);
    document.body.style.setProperty("--colorBgScrollBar", colorBgScrollBar);
    document.body.style.setProperty(
      "--colorBgScrollBarHover",
      colorBgScrollBarHover
    );
    document.body.style.setProperty(
      "--colorBgScrollBarActive",
      colorBgScrollBarActive
    );
    document.body.style.setProperty(
      "--colorSettings",
      token.colorSettings || defaultTheme?.token?.colorSettings || ""
    );
    document.body.style.setProperty(
      "--colorBgSettingsHover",
      token.colorBgSettingsHover
    );
    document.body.style.setProperty(
      "--colorBorderSettingsHover",
      token.colorBorderSettingsHover
    );
    document.body.style.setProperty(
      "--nodeContentBgColor",
      token.nodeContentBgColor
    );

    // 设置登录页面的背景色
    document.body.style.setProperty("--text-white", token.textWhite);
    document.body.style.setProperty("--text-common", token.textCommon);
    document.body.style.setProperty("--text-light", token.textLight);
    document.body.style.setProperty("--text-primary", token.textPrimary);
    document.body.style.setProperty("--text-noselect", token.textNoselect);
    document.body.style.setProperty("--text-select", token.textSelect);
    document.body.style.setProperty("--text-tag", token.textTag);
    document.body.style.setProperty("--text-num", token.textNum);
    document.body.style.setProperty("--text-num-light", token.textNumLight);
    document.body.style.setProperty("--thumb-color", token.thumbColor);
  }, [
    colorBgScrollBar,
    colorBgScrollBarActive,
    colorBgScrollBarHover,
    colorBgScrollTrack,
    token.colorBgContainer,
    token.colorBgLayout,
    token.colorBgSettingsHover,
    token.colorBorderSettingsHover,
    token.colorInfoBg,
    token.colorInfoBorder,
    token.colorPrimaryText,
    token.colorPrimaryTextActive,
    token.colorPrimaryTextHover,
    token.colorSettings,
    token.colorText,
    token.colorWarningBg,
    token.colorWarningBorder,
    token.controlHeightLG,
    token.marginLG,
    token.marginSM,
    token.marginXS,
    token.paddingContentVerticalSM,
    token.sizeXXL,
    token.nodeContentBgColor,
    token.textWhite,
    token.textCommon,
    token.textLight,
    token.textPrimary,
    token.textNoselect,
    token.textSelect,
    token.textTag,
    token.textNum,
    token.textNumLight,
    token.thumbColor,
  ]);

  return children;
};

CSSVariableProvider.displayName = "CSSVariableProvider";

export default CSSVariableProvider;
