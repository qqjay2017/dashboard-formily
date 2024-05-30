import React from "react";
import { APiWrap, useRequest } from "../api-client/hooks";
import { get } from "lodash-es";
import { CreateFormBtn } from "./components/CreateFormBtn";
import { DashboardItem } from "./types";
import { Badge, Button, Card, Col, Grid, Row, Space } from "antd";

export const HomeList = () => {
  const { data } = useRequest<APiWrap<DashboardItem[]>>(
    "/huang-api/dashboard",
    {
      method: "GET",
    }
  );

  const list = get(data, "data.data", []);

  return (
    <div className="container pt-4">
      <h2 className="text-4xl font-bold col-span-2">列表</h2>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <CreateFormBtn />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Row gutter={16}>
          {list.map((dashboard) => (
            <Col className="gutter-row" key={dashboard.id} span={6}>
              <FormCard dashboard={dashboard}></FormCard>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

function FormCard({ dashboard }: { dashboard: DashboardItem }) {
  return (
    <Card>
      <div>
        <span className=" truncate font-bold">{dashboard.name}</span>
        {dashboard.published && <Badge>已发布</Badge>}
        {!dashboard.published && <Badge>草稿</Badge>}
      </div>

      <div>{dashboard.description || "No description"}</div>
      <Space>
        <Button>预览</Button>
        <Button>编辑</Button>
      </Space>
    </Card>
  );
}
