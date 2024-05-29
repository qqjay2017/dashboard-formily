import { ConfigProvider } from "antd"
import { PropsWithChildren } from "react"
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import { GlobalThemeProvider } from "../css-variable";

interface AppMainProviderProps extends PropsWithChildren {

}


export const AppMainProvider = ({ children }: AppMainProviderProps) => {
    return (
        <GlobalThemeProvider>
            <ConfigProvider
                locale={zhCN}
            >
                {children}
            </ConfigProvider>
        </GlobalThemeProvider>
    )
}
