import React, {
    HTMLAttributes,
    PropsWithChildren,

    useContext,
    useMemo,
    useState,
} from "react";

import { useBreakpoints } from "./hooks";

import { DashboardComponentContext, DashboardRootContext } from "./context";
import { defaultBreakpoints, sizeFormat } from "./utils";
import { useUpdate } from "ahooks";
import { useFieldSchema } from "@formily/react";
import { createStyles } from "antd-style";
import { rs } from "../utils/resolveStatic";
import { cn } from "../utils";
import { allThemeNameMap } from "../dashboard-themes";
import { ConfigProvider } from "antd";
import { CSSVariableProvider, GlobalThemeProvider } from "../css-variable";

import { useDashboardRootDesigner } from "./hooks/useDashboardRootDesigner";

export interface DashboardRootRendererProviderProps extends PropsWithChildren, HTMLAttributes<any> {
    cols?: number;
    designable?: boolean;
    distributed?: boolean;
    designWidth?: number;
    designHeight?: number;
    breakpoints?: {
        showroom: number;
        desktop: number;
        tablet: number;
        mobile: number;
    };
    themeProvider?: string;
    rows?: 12;
    rowheight?: 80;
    dndContext?: any;
    className?: string;
    style?: React.CSSProperties;
    isDarkTheme?: boolean
}

const useDashboardRootStyle = createStyles(({ css }) => {
    return css`
    background-image: url(${rs("/assets/jfDarkTheme/main-bg.jpg")});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    font-size: 14px;
    color: #c3d4e5;
    &.jfLightTheme {
    background-image: url(${rs("/assets/jfLightTheme/main-bg.jpg")});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  font-size: 14px;
  color: #000;
    }
  `;
});

export function DashboardRoot({
    children,
    ...props
}: DashboardRootRendererProviderProps) {
    console.log(props, 'root props')
    const {
        breakpoints = defaultBreakpoints,
        designWidth = 1920,
        designHeight = 1080,
        cols = 12,
        rows = 12,
        rowheight: mobileRowHeight = 80,
        themeProvider = "",
        distributed,
        className,
        style,
        isDarkTheme,
        ...otherProps
    } = props;

    const { designable: defaultDesignable, ...restCtx } = useContext(
        DashboardComponentContext
    );
    const [designable, setDesignable] = useState(defaultDesignable || false);
    const [handleIds, setHandleIds] = useState<string[]>([]);
    const rootFieldSchema = useFieldSchema();
    const refresh = useUpdate();

    const { breakpoint, width, height, ref } = useBreakpoints(breakpoints, 800);

    const isPc = breakpoint === "desktop" || breakpoint === "showroom";

    const rowHeight = sizeFormat(height / rows);

    const colWidth = cols && width ? sizeFormat(width / cols) : 0;

    const scale = useMemo(() => {
        let scale = 1;
        if (!width || !height) {
            return scale;
        }

        if (width / height < designWidth / designHeight) {
            scale = width / designWidth;
        } else {
            scale = height / designHeight;
        }
        if (scale < 0.2) {
            return 0.2;
        }
        if (scale > 1.2) {
            return 1.2;
        }
        return scale;
    }, [designWidth, designHeight, width, height]);

    const rootStyle = useDashboardRootStyle();
    const themeToken = allThemeNameMap[themeProvider]?.token || {};

    // const { patch } = useDesignable()
    const DashboardRootDesigner = useDashboardRootDesigner()
    return (
        <GlobalThemeProvider theme={themeToken} isDarkTheme={isDarkTheme}>
            <CSSVariableProvider>
                <DashboardRootContext.Provider
                    value={{
                        breakpoint,
                        colWidth,
                        rowHeight,
                        isPc,
                        designWidth,
                        designHeight,
                        themeProvider,
                        scale,
                        rootFieldSchema,
                        mobileRowHeight,
                    }}
                >
                    <DashboardComponentContext.Provider
                        value={{
                            ...restCtx,
                            refresh,
                            designable,
                            setDesignable,
                            distributed,
                            handleIds,
                            setHandleIds,
                        }}
                    >
                        <div
                            {...otherProps}
                            ref={ref}
                            className={cn(rootStyle.styles, className, themeProvider)}
                            style={{
                                width: "100%",
                                height: "100%",
                                position: "relative",
                                ...style,
                            }}
                        >
                            <DashboardRootDesigner />
                            {children}
                        </div>
                    </DashboardComponentContext.Provider>
                </DashboardRootContext.Provider>
            </CSSVariableProvider>
        </GlobalThemeProvider>
    );
}

DashboardRoot.schema = {
    name: 'root',
    type: 'void',
    'x-component': 'DashboardRoot',
    "x-settings": "settings:root",
    "x-settings-props": {

    }
}