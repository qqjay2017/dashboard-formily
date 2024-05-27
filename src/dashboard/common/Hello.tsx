import { useFieldSchema } from "@formily/react";
import { PropsWithChildren, memo } from "react";

export const Hello = (props: PropsWithChildren) => {
    const { name } = useFieldSchema()
    console.log(name, '重新渲染')
    return <div style={{
        width: '100%',
        height: '100%'
    }}>
        <div style={{
            height: 40
        }} onClick={e => {
            console.log("hello")
        }}>
            {name}
            Hello, world!</div>

        <div style={{
            height: 'calc( 100% - 40px )'
        }}>
            {props.children}
        </div>
    </div >;
}