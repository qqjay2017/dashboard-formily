import { PropsWithChildren } from "react";

export const Hello = (props: PropsWithChildren) => {


    return <div style={{
        width: '100%',
        height: '100%'
    }}>
        <div style={{
            height: 40
        }}>Hello, world!</div>

        <div style={{
            height: 'calc( 100% - 40px )'
        }}>
            {props.children}
        </div>
    </div >;
}