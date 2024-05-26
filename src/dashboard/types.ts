import { PropsWithChildren } from "react";




export type BreakpointKey = "showroom" | "desktop" | "tablet" | "mobile"

export type Breakpoints = Record<BreakpointKey, number>;

export interface DashboardRootRendererContextValue {
    breakpoint: BreakpointKey,
    colWidth: number,
    rowHeight: number,
    isPc: boolean
    designWidth: number,
    designHeight: number,
    themeProvider: string;
    scale: number;
}


export interface DashboardComponentContextValue {

    refresh?: () => void;
    designable?: boolean;
    setDesignable?: (value: boolean) => void;
    distributed?: boolean;
    handleIds?: string[],
    setHandleIds?: React.Dispatch<React.SetStateAction<string[]>>
}

export interface PositionDecoratorOptions {
    w: number;
    h: number;
    x: number;
    y: number;
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
    padding?: number | string | number[];
    overflowHidden?: boolean;
    style?: React.CSSProperties;
    zIndex?: number;
    className?: string;
}

export interface SchemaToolbarProps extends PropsWithChildren {
    title?: string | string[];
    draggable?: boolean;
    resizable?: boolean;
    // initializer?: string | SchemaInitializer<any> | false;
    // settings?: string | SchemaSettings<any> | false;
    /**
     * @default true
     */
    showBorder?: boolean;
    showBackground?: boolean;
}
