import { useCallback, useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Table, Tag, Alert, Space, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { StatusBadge } from "../components/common/StatusBadge";
import { TimelineEventCell } from "../components/common/CalendarCell";
import { useReservationStore } from "../stores/reservationStore";
import { useEquipmentStore } from "../stores/equipmentStore";
import { equipmentApi } from "../api/equipment";
import type { Reservation, ConflictItem, TimelineEvent } from "../types/reservation";

const { RangePicker } = DatePicker;

export function ReservationManage() {
  const { items, loading, load, checkConflicts, create, approve, cancel } = useReservationStore();
  const { items: equipmentList, load: loadEquipment } = useEquipmentStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>("");
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [form] = Form.useForm();
  const [checkingConflicts, setCheckingConflicts] = useState(false);
  const [currentConflicts, setCurrentConflicts] = useState<ConflictItem[]>([]);
  const [conflictChecked, setConflictChecked] = useState(false);

  useEffect(() => {
    load();
    loadEquipment();
  }, [load, loadEquipment]);

  const loadTimeline = useCallback(async (equipmentId: string) => {
    if (!equipmentId) {
      setTimelineEvents([]);
      return;
    }
    const events = await equipmentApi.timeline(equipmentId);
    setTimelineEvents(events);
  }, []);

  const handleEquipmentChange = useCallback(
    (equipmentId: string) => {
      setSelectedEquipmentId(equipmentId);
      setCurrentConflicts([]);
      setConflictChecked(false);
      loadTimeline(equipmentId);
    },
    [loadTimeline]
  );

  const handleTimeChange = useCallback(() => {
    setCurrentConflicts([]);
    setConflictChecked(false);
  }, []);

  const handleCheckConflicts = useCallback(async () => {
    const values = form.getFieldsValue();
    const equipmentId = values.equipmentId;
    const timeRange = values.timeRange;
    if (!equipmentId || !timeRange || timeRange.length < 2) {
      message.warning("请先选择设备和时间段");
      return;
    }
    const startsAt = timeRange[0].toISOString();
    const endsAt = timeRange[1].toISOString();
    setCheckingConflicts(true);
    try {
      const result = await checkConflicts(equipmentId, startsAt, endsAt);
      setCurrentConflicts(result);
      setConflictChecked(true);
      if (result.length === 0) {
        message.success("未发现时间冲突，可以提交预约");
      } else {
        message.warning(`发现 ${result.length} 条时间冲突`);
      }
    } finally {
      setCheckingConflicts(false);
    }
  }, [form, checkConflicts]);

  const handleSubmit = useCallback(async () => {
    const values = await form.validateFields();
    const startsAt = values.timeRange[0].toISOString();
    const endsAt = values.timeRange[1].toISOString();
    try {
      await create({ equipmentId: values.equipmentId, startsAt, endsAt, purpose: values.purpose });
      message.success("预约创建成功");
      setModalOpen(false);
      form.resetFields();
      setCurrentConflicts([]);
      setConflictChecked(false);
      setSelectedEquipmentId("");
      setTimelineEvents([]);
      load();
    } catch {
      message.error("预约创建失败，请检查是否存在时间冲突");
    }
  }, [form, create, load]);

  const handleApprove = useCallback(
    async (id: string, approved: boolean) => {
      await approve(id, approved);
      message.success(approved ? "已审批通过" : "已拒绝");
      load();
    },
    [approve, load]
  );

  const handleCancel = useCallback(
    async (id: string) => {
      await cancel(id);
      message.success("已取消预约");
      load();
    },
    [cancel, load]
  );

  const columns: ColumnsType<Reservation> = [
    { title: "设备ID", dataIndex: "equipmentId", key: "equipmentId", width: 120 },
    { title: "预约人", dataIndex: "reserverId", key: "reserverId", width: 100 },
    {
      title: "开始时间",
      dataIndex: "startsAt",
      key: "startsAt",
      width: 180,
      render: (v: string) => new Date(v).toLocaleString("zh-CN")
    },
    {
      title: "结束时间",
      dataIndex: "endsAt",
      key: "endsAt",
      width: 180,
      render: (v: string) => new Date(v).toLocaleString("zh-CN")
    },
    { title: "使用目的", dataIndex: "purpose", key: "purpose" },
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
      width: 180,
      render: (_: unknown, record: Reservation) => (
        <Space>
          {record.status === "Pending" && (
            <>
              <Button size="small" type="primary" onClick={() => handleApprove(record.id, true)}>通过</Button>
              <Button size="small" danger onClick={() => handleApprove(record.id, false)}>拒绝</Button>
            </>
          )}
          {record.status !== "Cancelled" && record.status !== "Rejected" && (
            <Button size="small" onClick={() => handleCancel(record.id)}>取消</Button>
          )}
        </Space>
      )
    }
  ];

  const conflictTypeTag: Record<string, { color: string; label: string }> = {
    borrow: { color: "orange", label: "借用冲突" },
    maintenance: { color: "red", label: "维保冲突" },
    reservation: { color: "blue", label: "预约冲突" }
  };

  return (
    <section style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>预约管理</h2>
        <Button type="primary" onClick={() => setModalOpen(true)}>创建预约</Button>
      </div>

      <Table
        rowKey="id"
        dataSource={items}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="创建预约"
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
          setCurrentConflicts([]);
          setConflictChecked(false);
          setSelectedEquipmentId("");
          setTimelineEvents([]);
        }}
        okButtonProps={{ disabled: currentConflicts.length > 0 }}
        width={680}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="equipmentId" label="选择设备" rules={[{ required: true, message: "请选择设备" }]}>
            <Select
              placeholder="请选择设备"
              onChange={handleEquipmentChange}
              options={equipmentList.map((e) => ({ label: `${e.name} (${e.equipmentNo})`, value: e.id }))}
            />
          </Form.Item>
          <Form.Item name="timeRange" label="预约时间段" rules={[{ required: true, message: "请选择时间段" }]}>
            <RangePicker showTime style={{ width: "100%" }} onChange={handleTimeChange} />
          </Form.Item>
          <Form.Item name="purpose" label="使用目的" rules={[{ required: true, message: "请填写使用目的" }]}>
            <Input.TextArea rows={2} placeholder="请简述预约使用目的" />
          </Form.Item>
        </Form>

        <Button
          type="dashed"
          onClick={handleCheckConflicts}
          loading={checkingConflicts}
          style={{ marginBottom: 12, width: "100%" }}
        >
          检查时间冲突
        </Button>

        {conflictChecked && currentConflicts.length === 0 && (
          <Alert type="success" message="未发现冲突，该时间段可用" style={{ marginBottom: 12 }} />
        )}

        {currentConflicts.length > 0 && (
          <Alert
            type="error"
            message={`发现 ${currentConflicts.length} 条时间冲突，请调整预约时间`}
            style={{ marginBottom: 12 }}
            description={
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {currentConflicts.map((c) => (
                  <li key={c.id}>
                    <Tag color={conflictTypeTag[c.type]?.color}>{conflictTypeTag[c.type]?.label}</Tag>
                    {c.label}
                  </li>
                ))}
              </ul>
            }
          />
        )}

        {selectedEquipmentId && timelineEvents.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <h4 style={{ marginBottom: 8 }}>设备占用日历</h4>
            <div style={{ maxHeight: 240, overflow: "auto", border: "1px solid #f0f0f0", borderRadius: 6, padding: 8 }}>
              {timelineEvents.map((event) => (
                <TimelineEventCell key={`${event.type}-${event.id}`} event={event} />
              ))}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
