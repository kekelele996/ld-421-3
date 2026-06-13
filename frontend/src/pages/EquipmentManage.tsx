import { useCallback, useEffect, useState } from "react";
import { Button, Card, Descriptions, Input, Modal, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { StatusBadge } from "../components/common/StatusBadge";
import { TimelineEventCell } from "../components/common/CalendarCell";
import { useEquipmentStore } from "../stores/equipmentStore";
import { equipmentApi } from "../api/equipment";
import type { Equipment } from "../types/equipment";
import type { TimelineEvent } from "../types/reservation";

export function EquipmentManage() {
  const { items, load } = useEquipmentStore();
  const [search, setSearch] = useState("");
  const [detailItem, setDetailItem] = useState<Equipment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = useCallback(() => {
    load(search);
  }, [search, load]);

  const handleDetail = useCallback(async (record: Equipment) => {
    const item = await equipmentApi.detail(record.id);
    setDetailItem(item as Equipment);
    setDetailOpen(true);
    const events = await equipmentApi.timeline(record.id);
    setTimelineEvents(events);
  }, []);

  const columns: ColumnsType<Equipment> = [
    { title: "设备名称", dataIndex: "name", key: "name", width: 160 },
    { title: "设备编号", dataIndex: "equipmentNo", key: "equipmentNo", width: 160 },
    { title: "品牌型号", dataIndex: "brandModel", key: "brandModel", width: 180 },
    { title: "存放位置", dataIndex: "location", key: "location" },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (v: string) => <StatusBadge value={v} />
    },
    {
      title: "操作",
      key: "action",
      width: 80,
      render: (_: unknown, record: Equipment) => (
        <Button type="link" size="small" onClick={() => handleDetail(record)}>详情</Button>
      )
    }
  ];

  return (
    <section style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>设备管理</h2>
        <Space>
          <Input.Search
            placeholder="搜索设备名称/编号"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 260 }}
            allowClear
          />
        </Space>
      </div>

      <Table rowKey="id" dataSource={items} columns={columns} pagination={{ pageSize: 10 }} />

      <Modal
        title="设备详情"
        open={detailOpen}
        onCancel={() => {
          setDetailOpen(false);
          setDetailItem(null);
          setTimelineEvents([]);
        }}
        footer={null}
        width={720}
      >
        {detailItem && (
          <div>
            <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="设备名称">{detailItem.name}</Descriptions.Item>
              <Descriptions.Item label="设备编号">{detailItem.equipmentNo}</Descriptions.Item>
              <Descriptions.Item label="品牌型号">{detailItem.brandModel}</Descriptions.Item>
              <Descriptions.Item label="序列号">{detailItem.serialNumber}</Descriptions.Item>
              <Descriptions.Item label="存放位置">{detailItem.location}</Descriptions.Item>
              <Descriptions.Item label="状态"><StatusBadge value={detailItem.status} /></Descriptions.Item>
              <Descriptions.Item label="购买日期">{detailItem.purchaseDate}</Descriptions.Item>
              <Descriptions.Item label="购买价格">¥{detailItem.purchasePrice?.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="保修到期">{detailItem.warrantyExpiresAt}</Descriptions.Item>
              <Descriptions.Item label="供应商">{detailItem.supplier}</Descriptions.Item>
            </Descriptions>

            <Card
              title="占用时段日历"
              size="small"
              style={{ marginTop: 8 }}
              extra={
                <Space>
                  <Tag color="orange">借用</Tag>
                  <Tag color="red">维保</Tag>
                  <Tag color="blue">预约</Tag>
                </Space>
              }
            >
              {timelineEvents.length === 0 ? (
                <div style={{ textAlign: "center", color: "#999", padding: 16 }}>暂无占用记录</div>
              ) : (
                <div style={{ maxHeight: 320, overflow: "auto" }}>
                  {timelineEvents.map((event) => (
                    <TimelineEventCell key={`${event.type}-${event.id}`} event={event} />
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </Modal>
    </section>
  );
}
