


export * from './TechnologyBlue'
export * from './RomanRed'

import customed from './themes/customed.json'
import dark from './themes/dark.json'
import chalk from './themes/chalk.json'
import essos from './themes/essos.json'
import macarons from './themes/macarons.json'
import purplePassion from './themes/purple-passion.json'
import roma from './themes/roma.json'
import shine from './themes/shine.json'
import vintage from './themes/vintage.json'
import walden from './themes/walden.json'
import westeros from './themes/westeros.json'
import wonderland from './themes/wonderland.json'
import { technologyBlueToken } from './TechnologyBlue'
import { romanRedToken } from './RomanRed'



export const allThemes = [
    {
        name: "TechnologyBlue",
        zhName: "科技蓝",
        token: technologyBlueToken
    },
    {
        name: "RomanRed",
        zhName: "罗马红",
        token: romanRedToken
    },

]

export const allThemeNameMap = allThemes.reduce((memo, cur) => {
    memo[cur.name] = cur
    return memo;
}, {})

export const chartColors = {
    dark,
    customed,
    macarons,
    walden,
    purplePassion,
    vintage,
    chalk,
    westeros,
    wonderland,
    essos,
    shine,
    roma
}
