import { jfDarkThemeToken } from './jfDarkTheme'
import { jfLightThemeToken } from './jfLightTheme'

export * from './jfDarkTheme'
export * from './jfLightTheme'



export const allThemes = [
    {
        name: "jfLightTheme",
        token: jfLightThemeToken
    },
    {
        name: "jfDarkTheme",
        token: jfDarkThemeToken
    },
]

export const allThemeNameMap = allThemes.reduce((memo, cur) => {
    memo[cur.name] = cur
    return memo;
}, {})