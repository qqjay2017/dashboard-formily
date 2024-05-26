export const DragHandler = (props: any) => {
    return (
        <div
            className={props.className}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 14,
                height: 14,
                overflow: 'hidden',
                background: 'var( --colorSettings )',
                color: '#fff',
                lineHeight: '14px',
                textAlign: 'left',
                cursor: 'move', fontSize: 14,
                position: 'relative',
            }}
        >
            {props.children}
        </div>
    );
};
