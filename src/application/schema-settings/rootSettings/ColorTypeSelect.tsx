import React from 'react'
import { allThemes } from '../../../dashboard-themes';
import { Radio } from 'antd';


interface ColorTypeSelectProps {
    value: string;
    onChange: () => string;
}
export const ColorTypeSelect = ({
    value, onChange
}: ColorTypeSelectProps) => {
    return (

        <Radio.Group
            optionType="button"
            buttonStyle="solid"
            options={allThemes.map(theme => {
                return {
                    label: theme.zhName,
                    value: theme.name
                }
            })}
            onChange={onChange}
            value={value} />

    )
}
