import { PropsWithChildren, useMemo, useRef } from "react"
import { BlockItemError } from "./common/BlockItemError"
import { PositionDecoratorOptions } from "./types"
import { useDashboardComponent, useDashboardRoot } from "./hooks"
import { sizeFormat } from "./utils"

import { Rnd } from "react-rnd";
import { useField, useFieldSchema } from "@formily/react"


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
// TODO 编辑++
export const PositionDecoratorHandle = (props: PropsWithChildren<PositionDecoratorOptions>) => {
    console.log(props, 'props')
    return <div>123PositionDecoratorHandle</div>

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
