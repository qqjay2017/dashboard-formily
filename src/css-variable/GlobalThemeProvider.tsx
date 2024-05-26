import { ConfigProvider, ThemeConfig, theme as antdTheme } from "antd";
import { GlobalThemeContext } from "./GlobalThemeContext";
import { PropsWithChildren, useCallback, useMemo, useRef, useState } from "react";
import { ThemeItem } from "./type";
import defaultTheme from "./defaultTheme";
import compatOldTheme from "./compatOldTheme";
import { cloneDeep } from "lodash-es";
import { addCustomAlgorithmToTheme } from "./customAlgorithm";


export const GlobalThemeProvider = ({ children, theme: themeFromProps }: PropsWithChildren<any>) => {
    const [theme, setTheme] = useState<ThemeConfig>(themeFromProps || defaultTheme);
    const currentSettingThemeRef = useRef<ThemeConfig>(null!);
    const currentEditingThemeRef = useRef<ThemeItem>(null!);

    const isDarkTheme = useMemo(() => {
        const algorithm = theme?.algorithm;
        if (Array.isArray(algorithm)) {
            return algorithm.includes(antdTheme.darkAlgorithm);
        }
        return algorithm === antdTheme.darkAlgorithm;
    }, [theme?.algorithm]);

    const setCurrentEditingTheme = useCallback((themeItem: ThemeItem) => {
        currentEditingThemeRef.current = themeItem ? cloneDeep(themeItem) : themeItem;
    }, []);

    const getCurrentEditingTheme = useCallback(() => {
        return currentEditingThemeRef.current;
    }, []);

    const setCurrentSettingTheme = useCallback((theme: ThemeConfig) => {
        currentSettingThemeRef.current = theme ? cloneDeep(theme) : theme;
    }, []);

    const getCurrentSettingTheme = useCallback(() => {
        return currentSettingThemeRef.current;
    }, []);

    const value = useMemo(() => {
        return {
            theme: addCustomAlgorithmToTheme(theme as any),
            setTheme,
            setCurrentSettingTheme,
            getCurrentSettingTheme,
            setCurrentEditingTheme,
            getCurrentEditingTheme,
            isDarkTheme,
        };
    }, [
        getCurrentEditingTheme,
        getCurrentSettingTheme,
        isDarkTheme,
        setCurrentEditingTheme,
        setCurrentSettingTheme,
        theme,
    ]);

    return (
        <GlobalThemeContext.Provider value={value as any}>
            <ConfigProvider theme={compatOldTheme(value.theme)}>{children}</ConfigProvider>
        </GlobalThemeContext.Provider>
    );
};