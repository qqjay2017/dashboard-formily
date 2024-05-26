
import { DashboardRoot, PositionDecorator } from '../dashboard'
import { Hello } from '../dashboard/common/Hello'

export const DashbaordBase1 = () => {
    return (
        <DashboardRoot>
            <PositionDecorator
                w={2}
                h={2}
                x={2}
                y={2}
            >
                <Hello>123</Hello>
            </PositionDecorator>
        </DashboardRoot>
    )
}
