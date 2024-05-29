import React from 'react'


interface ColorTypeSelectProps {
    value: string;
    onChange: () => string;
}
export const ColorTypeSelect = ({
    value, onChange
}: ColorTypeSelectProps) => {
    return (
        <div>
            <div>科技蓝</div>
            <div>罗马红</div>
        </div>
    )
}
