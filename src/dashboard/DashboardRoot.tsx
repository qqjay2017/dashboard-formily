import React, {
  HTMLAttributes,
  PropsWithChildren,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import { useBreakpoints } from "./hooks";
import Selecto from "react-selecto";
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

export interface DashboardRootRendererProviderProps
  extends PropsWithChildren,
    HTMLAttributes<any> {
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
  isDarkTheme?: boolean;
}

const useDashboardRootStyle = createStyles(
  (
    { css },
    {
      themeProvider,
      isDarkTheme,
    }: {
      themeProvider: string;
      isDarkTheme: boolean;
    }
  ) => {
    if (themeProvider === "technologyBlue") {
      if (!isDarkTheme) {
        return css`
          background-image: url(${rs("/assets/jfLightTheme/main-bg.jpg")});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          font-size: 14px;
          color: #000;
        `;
      }
      return css`
        background-image: url(${rs("/assets/jfDarkTheme/main-bg.jpg")});
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        font-size: 14px;
        color: #c3d4e5;
      `;
    }
  }
);

export function DashboardRoot({
  children,
  ...props
}: DashboardRootRendererProviderProps) {
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
  const selectoRef = useRef<Selecto>(null);
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

  const themeConfig = allThemeNameMap[themeProvider] || {};
  const themeToken = themeConfig?.token || {};
  const themeDarkOrLightToken = themeConfig?.[isDarkTheme ? "dark" : "light"];

  const rootStyle = useDashboardRootStyle({
    themeProvider,
    isDarkTheme,
  });
  // const { patch } = useDesignable()
  const DashboardRootDesigner = useDashboardRootDesigner();

  return (
    <GlobalThemeProvider
      theme={{
        token: {
          ...themeToken,
          ...themeDarkOrLightToken,
        },
      }}
      isDarkTheme={isDarkTheme}
    >
      <ConfigProvider
        theme={{
          token: {
            ...themeToken,
            ...themeDarkOrLightToken,
          },
        }}
      >
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
                <Selecto
                  ref={selectoRef}
                  // dragContainer={container.current}
                  selectableTargets={[".anticon .anticon-menu .cube"]}
                  hitRate={0}
                  selectByClick={true}
                  selectFromInside={false}
                  toggleContinueSelect={["shift"]}
                  ratio={0}
                  onDragStart={(e) => {
                    console.log(e, "e");
                    // const moveable = moveableRef.current!;
                    // const target = e.inputEvent.target;
                    // const flatted = deepFlat(targets);
                    // if (
                    //   target.tagName === "BUTTON" ||
                    //   moveable.isMoveableElement(target) ||
                    //   flatted.some((t) => t === target || t.contains(target))
                    // ) {
                    //   e.stop();
                    // }
                    // e.data.startTargets = targets;
                  }}
                  onSelect={(e) => {
                    console.log(e, "e");
                    // const { startAdded, startRemoved, isDragStartEnd } = e;
                    // if (isDragStartEnd) {
                    //   return;
                    // }
                    // const nextChilds = groupManager.selectSameDepthChilds(
                    //   e.data.startTargets,
                    //   startAdded,
                    //   startRemoved
                    // );
                    // setSelectedTargets(nextChilds.targets());
                  }}
                  onSelectEnd={(e) => {
                    console.log(e, "e");
                    // const {
                    //   isDragStartEnd,
                    //   isClick,
                    //   added,
                    //   removed,
                    //   inputEvent,
                    // } = e;
                    // const moveable = moveableRef.current!;
                    // if (isDragStartEnd) {
                    //   inputEvent.preventDefault();
                    //   moveable.waitToChangeTarget().then(() => {
                    //     moveable.dragStart(inputEvent);
                    //   });
                    // }
                    // let nextChilds: TargetList;
                    // if (isDragStartEnd || isClick) {
                    //   if (isCommand) {
                    //     nextChilds = groupManager.selectSingleChilds(
                    //       targets,
                    //       added,
                    //       removed
                    //     );
                    //   } else {
                    //     nextChilds = groupManager.selectCompletedChilds(
                    //       targets,
                    //       added,
                    //       removed,
                    //       isShift
                    //     );
                    //   }
                    // } else {
                    //   nextChilds = groupManager.selectSameDepthChilds(
                    //     e.data.startTargets,
                    //     added,
                    //     removed
                    //   );
                    // }
                    // e.currentTarget.setSelectedTargets(nextChilds.flatten());
                    // setSelectedTargets(nextChilds.targets());
                  }}
                ></Selecto>
              </div>
            </DashboardComponentContext.Provider>
          </DashboardRootContext.Provider>
        </CSSVariableProvider>
      </ConfigProvider>
    </GlobalThemeProvider>
  );
}

DashboardRoot.schema = {
  name: "root",
  type: "void",
  "x-component": "DashboardRoot",
  "x-settings": "settings:root",
  "x-settings-props": {},
};
