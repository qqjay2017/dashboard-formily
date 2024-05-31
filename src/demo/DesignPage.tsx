import { AppMainProvider } from "../app-main/AppMainProvider";
import {
  SchemaComponent,
  SchemaComponentProvider,
  dashboardComponentMap,
} from "../schema-component";
import { APiWrap, useRequest } from "../api-client/hooks";
import { useParams } from "react-router-dom";
import { DashboardItem } from "./types";
import { get } from "lodash-es";
import { Hello } from "../dashboard/common/Hello";

export const DesignPage = () => {
  const { id } = useParams();
  const { data } = useRequest<APiWrap<DashboardItem>>(
    `/huang-api/dashboard/${id}`,
    {
      method: "GET",
      refreshDeps: [id],
    }
  );
  const schema = get(data, "data.data.content", "");

  if (!schema) {
    return null;
  }
  return (
    <AppMainProvider>
      <SchemaComponentProvider designable={true}>
        <SchemaComponent
          components={{
            ...(dashboardComponentMap as any),
            Hello,
          }}
          schema={JSON.parse(schema)}
        />
      </SchemaComponentProvider>
    </AppMainProvider>
  );
};
