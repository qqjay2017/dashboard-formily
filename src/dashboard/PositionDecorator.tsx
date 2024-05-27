import { PropsWithChildren, useMemo } from "react"
import { BlockItemError } from "./common/BlockItemError"
import { PositionDecoratorOptions, SchemaToolbarProps } from "./types"
import { useDashboardComponent, useDashboardRoot } from "./hooks"
import { sizeFormat } from "./utils"
import { DragOutlined, } from '@ant-design/icons';
import { Rnd } from "react-rnd";
import { useField, useFieldSchema } from "@formily/react"
import { DragHandler } from "./common/DragHandler"
import { createStyles } from '../core'
import { useDesignable } from "../schema-component"
import { cn } from "../utils"

const resizeHandleStyles1: React.CSSProperties = {
    height: '7px',
    width: '30px',
    left: '50%',
    transform: 'translate(-50%, -1px )',
    backgroundColor: '#fff',
    border: '3px solid var(--colorSettings)',
    borderRadius: '5px'
}
const resizeHandleStyles2: React.CSSProperties = {
    height: '30px',
    width: '7px',
    transform: `translate( -1px , -50% )`,
    top: '50%',
    backgroundColor: '#fff',
    border: '3px solid var(--colorSettings)',
    borderRadius: '5px'
}


const useRndStyle = createStyles(({ css, }, { toolbarActive }: { toolbarActive?: boolean }) => {
    return css`
     border-width:1px;
      border-style:solid;
      border-color: ${toolbarActive ? "var( --colorBorderSettingsHover )" : "transparent"}; 
      &:hover {
        ${toolbarActive ? "" : " border-radius:5px; border-style:dashed; border-color:var( --colorBorderSettingsHover )"
        }
       ;
      }
    `
})
// TODO 编辑++
export const PositionDecoratorHandle = (props: PropsWithChildren<PositionDecoratorOptions>) => {
    const { patch } = useDesignable()
    const { children, x = 0, y = 0, w = 0, h = 0, zIndex = 2, style, padding = 12, className } = props
    const { colWidth, rowHeight } = useDashboardRoot()

    const { setHandleIds, handleIds } = useDashboardComponent()
    const field = useField()
    const fieldSchema = useFieldSchema();
    const eid = field.address.toString();
    const dragHandleClassName = `dragHandle-${eid}`.replace(/\./g, '-')

    const {
        draggable = true,
        resizable = true,
    } = { ...props, ...(fieldSchema['x-toolbar-props'] || {}) } as SchemaToolbarProps;

    const toolbarActive = handleIds && handleIds.includes(eid)

    const width = sizeFormat(colWidth * w);
    const height = sizeFormat(rowHeight * h);
    const rndStyle = useRndStyle({
        toolbarActive
    })


    const styleMemo = useMemo(() => {
        const s: React.CSSProperties = {
            ...style,
        };
        if (zIndex) {
            s.zIndex = zIndex;
        }
        if (padding) {
            s.padding = Array.isArray(padding)
                ? padding.map((p) => (p || 0) + "px").join(" ")
                : padding;
        }

        return s;
    }, [padding, style, zIndex]);


    const dragElement = useMemo(() => {
        if (!toolbarActive || !draggable) return null;
        return (
            <div style={{
                position: 'absolute',
                right: 4,
                top: 4,
                zIndex: 10
            }}>
                <DragHandler className={dragHandleClassName}>
                    <DragOutlined role="button" />
                </DragHandler>
            </div>
        );
    }, [draggable, dragHandleClassName, toolbarActive]);

    const enableResizing = resizable && toolbarActive
    return <Rnd
        onMouseDown={(e) => {
            e.stopPropagation()
            e.preventDefault()
            if (toolbarActive) {
                return false
            }

            setHandleIds && setHandleIds((oldIds) => {

                if (oldIds.includes(eid)) {
                    return oldIds
                }
                return [eid]
            })
        }}
        dragHandleClassName={dragHandleClassName}

        bounds="parent"
        className={cn(rndStyle.styles, className)}
        position={{
            x: sizeFormat(x * colWidth),
            y: sizeFormat(y * rowHeight),
        }}
        size={{
            width,
            height,
        }}
        style={{
            zIndex,
            padding: styleMemo.padding,
        }}
        disableDragging={!draggable}
        enableResizing={{
            bottom: enableResizing,
            left: enableResizing,
            right: enableResizing,
            top: enableResizing,
            bottomLeft: false,
            bottomRight: false,
            topLeft: false,
            topRight: false,
        }}
        resizeHandleStyles={{
            bottom: { ...resizeHandleStyles1, cursor: 's-resize' },
            top: { ...resizeHandleStyles1, transform: 'translate(-50%, 1px )', cursor: 'n-resize' },
            right: { ...resizeHandleStyles2, cursor: 'e-resize' },
            left: { ...resizeHandleStyles2, transform: 'translate( 1px , -50% )', cursor: 'w-resize' },

        }}
        onDragStop={(_, { x, y }) => {
            patch({
                "x-uid": "aabbcc",
                "x-decorator-props": {
                    w,
                    h,
                    x: sizeFormat(x / colWidth),
                    y: sizeFormat((y) / rowHeight)
                }
            })


        }}
        onResizeStop={(_, _d, ref: any) => {
            const newW = sizeFormat(parseInt(ref.style.width || 0, 10) / colWidth);
            const newH = sizeFormat(parseInt(ref.style.height || 0, 10) / rowHeight);

            const isLeft = _d === 'left'
            const isTop = _d === 'top'
            const offsetX = w - newW;
            const offsetY = h - newH;
            patch({
                "x-uid": "aabbcc",
                "x-decorator-props": {
                    w: newW,
                    h: newH,
                    x: isLeft ? x + offsetX : x,
                    y: isTop ? y + offsetY : y,
                }
            })
        }}
    >
        {dragElement}
        {children}
    </Rnd>

}

export const PositionDecoratorOnlyDisplay = (props: PropsWithChildren<PositionDecoratorOptions>) => {
    const { children, x = 0, y = 0, w = 0, h = 0, zIndex = 2, style, padding = 12, className, } = props
    const { colWidth, rowHeight } = useDashboardRoot()
    const styleMemo = useMemo(() => {
        const s: React.CSSProperties = {
            ...style,
        };
        if (zIndex) {
            s.zIndex = zIndex;
        }
        if (padding) {
            s.padding = Array.isArray(padding)
                ? padding.map((p) => (p || 0) + "px").join(" ")
                : padding;
        }

        return s;
    }, [padding, style, zIndex]);

    const width = sizeFormat(colWidth * w);
    const height = sizeFormat(rowHeight * h);

    return (
        <BlockItemError>
            <Rnd
                position={{
                    x: sizeFormat(x * colWidth),
                    y: sizeFormat(y * rowHeight),
                }}
                size={{
                    width,
                    height,
                }}
                style={{
                    zIndex,
                    padding: styleMemo.padding,
                }}
                disableDragging={true}
                enableResizing={false}
            >
                {children}
            </Rnd>
        </BlockItemError>
    )
}


export const PositionDecorator = (props: PropsWithChildren<PositionDecoratorOptions>) => {
    const field = useField()
    const fieldSchema = useFieldSchema()
    const { designable, } = useDashboardComponent();

    if (!field || !fieldSchema || !designable) {
        return <PositionDecoratorOnlyDisplay {...props} />
    } else {
        return <PositionDecoratorHandle  {...props} />
    }

}
