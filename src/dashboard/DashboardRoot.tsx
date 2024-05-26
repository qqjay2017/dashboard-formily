


import { PropsWithChildren, memo, useMemo, useState } from 'react'

import { useBreakpoints } from './hooks';


import { DashboardComponentContext, DashboardRootContext } from './context';
import { defaultBreakpoints, sizeFormat } from './utils';
import { useUpdate } from 'ahooks';


export interface DashboardRootRendererProviderProps extends PropsWithChildren {
    cols?: number;
    designable?: boolean;
    distributed?: boolean;
    designWidth?: number;
    designHeight?: number;
    breakpoints?: {
        showroom: number,
        desktop: number,
        tablet: number,
        mobile: number,
    }
    themeProvider?: string;
    rows?: 12,
    rowheight?: 80,
    dndContext?: any
}




export const DashboardRoot = memo(({ children, ...props }: DashboardRootRendererProviderProps) => {
    const { breakpoints = defaultBreakpoints, designWidth = 1920,
        designHeight = 1080, cols = 12, rows = 12, rowheight = 80,
        themeProvider = '', designable: defaultDesignable, distributed,
    } = props;
    const [designable, setDesignable] = useState(defaultDesignable || false)
    const [handleIds, setHandleIds] = useState<string[]>([])
    const refresh = useUpdate()


    const { breakpoint, width, height, ref } = useBreakpoints(breakpoints, 800);
    const isPc = breakpoint === 'desktop' || breakpoint === 'showroom';

    const rowHeight = isPc
        ? sizeFormat((height) / rows)
        : rowheight;
    const colWidth = cols && width ? sizeFormat(width / cols) : 0;

    const scale = useMemo(() => {
        let scale = 1;
        if (!width || !height) {
            return scale
        }

        if (width / height < designWidth / designHeight) {
            scale = width / designWidth
        } else {
            scale = height / designHeight
        }
        if (scale < 0.2) {
            return 0.2
        }
        if (scale > 1.2) {
            return 1.2
        }
        return scale
    }, [designWidth, designHeight, width, height])





    return (
        <DashboardRootContext.Provider value={{
            breakpoint,
            colWidth,
            rowHeight,
            isPc,
            designWidth,
            designHeight,
            themeProvider,
            scale,

        }}>
            <DashboardComponentContext.Provider value={{
                refresh,
                designable, setDesignable,
                distributed,
                handleIds,
                setHandleIds
            }}>
                <div ref={ref} style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative'
                }}>
                    {children}
                </div>
            </DashboardComponentContext.Provider>
        </DashboardRootContext.Provider>
    )
})

