
import { DashboardRoot, PositionDecorator } from '../dashboard'
import { ClassicFrame } from './widgets'
import * as antdComponents from './antd'
console.log(antdComponents, 'antdComponents')
export const dashboardComponentMap = {
    ...antdComponents,
    PositionDecorator,
    DashboardRoot,
    ClassicFrame

}