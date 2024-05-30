import { App, ConfigProvider } from "antd";
import React, { memo, useEffect } from "react";
import { useApp } from "../application/hooks";
import zh_CN from "antd/locale/zh_CN";
const AppInner = memo(({ children }: { children: React.ReactNode }) => {
  const app = useApp();
  const { notification } = App.useApp();

  useEffect(() => {
    // apiClient.notification = notification;
    app.notification = notification;
  }, [notification]);

  return <>{children}</>;
});
AppInner.displayName = "AppInner";

const AntdAppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <App
      style={{
        height: "100%",
      }}
    >
      <ConfigProvider locale={zh_CN}>
        <AppInner>{children}</AppInner>
      </ConfigProvider>
    </App>
  );
};

AntdAppProvider.displayName = "AntdAppProvider";

export default AntdAppProvider;
