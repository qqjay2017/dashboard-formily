import { createContext, useContext } from "react";
import { ThemeConfig, ThemeItem } from "./type";



interface GlobalThemeContextProps {
    theme: ThemeConfig;
    setTheme: React.Dispatch<React.SetStateAction<ThemeConfig>>;
    setCurrentSettingTheme: (theme: ThemeConfig) => void;
    getCurrentSettingTheme: () => ThemeConfig;
    setCurrentEditingTheme: (themeItem: ThemeItem) => void;
    getCurrentEditingTheme: () => ThemeItem;
    isDarkTheme: boolean;
}

export const GlobalThemeContext = createContext<GlobalThemeContextProps>(null!);
GlobalThemeContext.displayName = 'GlobalThemeContext';


export const useGlobalTheme = () => {
    return useContext(GlobalThemeContext) || ({ theme: {}, isDarkTheme: false } as GlobalThemeContextProps);
};
