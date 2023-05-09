import useFetch from "./../../hooks/use-fetch";
import API from "./../../api";
import { Table, Form, Input, Button, DatePicker, Select, Space } from "antd";
import formatDate from "../../utils/formatDate";

const { RangePicker } = DatePicker;

export default function Supervise() {
  const [form] = Form.useForm();

  const {
    // 获取到的可以渲染的数据
    tableData,
    // 可以修改过滤参数的方法
    setFilterParams,
    filterParams,
    total,
    isLoading
  } = useFetch({
    API: API.getInspec,
  });

  const columns = [
    {
      title: "检查时间",
      dataIndex: "inspectTime",
    },
    {
      /**
       * A 合格
       * B 不合格
       * C 已整改
       */
      title: "检查结果",
      dataIndex: "inspectResult",
      render: (text) => {
        switch (text) {
          case "A":
            return "合格";
          case "B":
            return "不合格";
          case "C":
            return "已整改";
          default:
            return "";
        }
      },
    },
    {
      title: "单位名称",
      dataIndex: "inspectResult",
      render: (text, record) => {
        return record.company?.companyName;
      },
    },
  ];

  const paginationChange = (page) => {
    setFilterParams({ ...filterParams, page });
  };

  const searchData = (values) => {
    console.log(values);
    if (values.inspectTime) {
      values.inspectStartTime = formatDate(values.inspectTime[0]);
      values.inspectEndTime = formatDate(values.inspectTime[1]);
    }
    setFilterParams({
      ...filterParams,
      ...values
    })
  };

  const onReset = () => {
    // 重置form里的数据
    form.resetFields();
    // 重置筛选数据
    setFilterParams({
      page: 1,
      size: 3,
      order: "createTime",
      sort: "desc",
      keyWord: "",
    });
  };
  return (
    <div>
      <Space>
        <Form form={form} layout="inline" onFinish={searchData}>
          <Form.Item label="检查结果" name="inspectResult">
            <Select
              style={{
                width: 80,
              }}
              options={[
                { label: "全部", value: "" },
                {
                  label: "合格",
                  value: "A",
                },
                {
                  label: "不合格",
                  value: "B",
                },
                {
                  label: "已整改",
                  value: "C",
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="检查时间" name="inspectTime">
            <RangePicker />
          </Form.Item>
          <Form.Item name="keyWord">
            <Input style={{ width: "50px" }}></Input>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
          <Button onClick={onReset}>重置</Button>
        </Form>
      </Space>
      <Table
        loading={isLoading}
        pagination={{
          current: filterParams.page,
          pageSize: filterParams.size,
          total,
          onChange: paginationChange,
        }}
        rowSelection={{
          type: "checkbox",
        }}
        style={{ marginTop: "20px" }}
        columns={columns}
        dataSource={tableData}
      />
    </div>
  );
}
