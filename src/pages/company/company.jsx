import {
  Space,
  Button,
  Form,
  Input,
  Select,
  Table,
  Image,
  Modal,
  message,
  DatePicker,
} from "antd";
import { useEffect, useState } from "react";
import API from "./../../api";
import formatDate from "./../../utils/formatDate";
import dayjs from "dayjs";

const { confirm } = Modal;

const { RangePicker } = DatePicker;

export default function Company() {
  const [tableData, setTableData] = useState([]);
  const [areas, setAreas] = useState([]);
  const [total, setTotal] = useState(0);
  const [filterParams, setFilterParams] = useState({
    page: 1,
    size: 3,
    order: "createTime",
    sort: "desc",
    keyWord: "",
    areaId: "",
    businessType: "",
    validStatus: "",
  });

  /**
   * 获取form实例的
   * 注意：5.x antd的版本hooks文档提示不全
   * 需要去4.x看 https://4x.ant.design/components/form-cn/#API
   */
  const [form] = Form.useForm();
  const [insertForm] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);

  const [delIds, setDelIds] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const businessTypes = [
    { label: "大型级以上餐饮", value: "1" },
    { label: "中型餐饮", value: "2" },
    { label: "小微型餐饮", value: "3" },
    { label: "学校食堂", value: "4" },
    { label: "托幼机构食堂", value: "5" },
    { label: "养老机构食堂", value: "6" },
    { label: "医疗机构食堂", value: "7" },
    { label: "其他", value: "8" },
  ];

  const validStatus = [
    {
      label: "正常",
      value: "NORMAL",
    },
    {
      label: "过期",
      value: "BEOVERDUE",
    },
    {
      label: "即将过期",
      value: "NEAREXPIRATION",
    },
  ];

  const columns = [
    {
      title: "序号",
      // 对象中要显示的字段
      dataIndex: "id",
      key: "id",
      /**
       * 重新这个现实的字段
       * @param {} text dataIndex表示的参数
       * @param {} record 当前的这条数据
       * @param {} index 当前下标
       * @returns
       */
      render: (text, record, index) => <a>{index + 1}</a>,
    },
    {
      title: "所属辖区",
      dataIndex: "areaName",
      key: "id",
    },
    {
      title: "经营类型",
      dataIndex: "businessType",
      key: "id",
      render: (text) => (
        <a>{businessTypes.find((item) => item.value === text)?.label}</a>
      ),
    },
    {
      title: "门店名称",
      dataIndex: "storeName",
      key: "id",
    },
    {
      title: "许可证有效期",
      dataIndex: "storeName",
      key: "id",
      render: (text, record) => (
        <div>
          {formatDate(record.validStartTime)}-{formatDate(record.validEndTime)}
        </div>
      ),
    },
    {
      title: "门头图片",
      dataIndex: "sotreImage",
      key: "id",
      render: (text) => <Image width={50} src={text} />,
    },
    {
      title: "操作",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <Space>
          <Button type="primary" onClick={() => editModal(id)}>
            编辑
          </Button>
          <Button danger onClick={() => del([id])}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const editModal = async (id) => {
    // 打开弹框
    setIsModalOpen(true);
    // 拿到当前要回显的数据
    const data = await API.getCompanyDetail(id);
    if (data.areaId) {
      data.areaId = Number(data.areaId);
    }

    /**
     * 把后端返回的数据，转换成前端能够展示的数据
     */
    if (data.validStartTime) {
      /**
       * 使用dayjs转成moment对象
       * 才可以正常回显
       */
      data.validTime = [
        dayjs(data.validStartTime, "YYYY/MM/DD"),
        dayjs(data.validEndTime, "YYYY/MM/DD"),
      ];
    }
    insertForm.setFieldsValue(data);
  };

  /**
   * 如果id存在那么代表单删
   * 不存在代表多删
   * @param {} id
   */
  const del = async (ids = delIds) => {
    confirm({
      title: "确定要删除数据吗，删了别来找我们",
      async onOk() {
        // 调用删除
        await API.delCompany({ ids });
        /**
         * 重置分页参数
         * 不重置筛选项（不一定）
         * 通过副作用调用列表接口
         */
        setFilterParams({
          ...filterParams,
          page: 1,
        });

        // 清空多选删除的选项
        setDelIds([]);
        message.success("删除成功");
      },
    });
  };

  useEffect(() => {
    getAreas();
  }, []);

  /**
   * 首次渲染的时候调用一次
   * 每次filterParams变化的时候调用一次
   *
   * 分页参数变化会调用
   * 顶栏筛选会调用
   * 重置也会调用
   *
   * 本质上来说都是修改了filterParams这个状态
   *
   */
  useEffect(() => {
    getCompany();
  }, [filterParams]);

  const getCompany = async () => {
    // 接口调用前打开loading
    setIsLoading(true);
    const data = await API.getCompany(filterParams);
    // 给每条数据增加key
    data.list.forEach((item) => {
      // 这样选择的时候就可以直接拿到对应的id
      item.key = item.id;
    });
    setTableData(data.list);
    setTotal(data.pagination.total);
    setIsLoading(false);
  };

  const getAreas = async () => {
    const data = await API.getAreas();
    setAreas(
      data.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      })
    );
  };

  const paginationChange = (page) => {
    setFilterParams({ ...filterParams, page });
    /**
     * 这里可以重新调用接口吗
     * 这里不可以重新掉接口，因为setState是异步的，我们
     * 无法再下一行拿到最新的状态
     */
  };

  const searchData = (values) => {
    //
    /**
     * 修改过滤数据
     * 注意：所有的项目
     * 修改下拉或者特定筛选项的时候，
     * 都要重置page为1
     */
    setFilterParams({ ...filterParams, ...values, page: 1 });

    // 数据传到后端
    /**
     * 因为我们统一监听了filterParams的变化
     * 每次变化都会重新调用接口，那么我们就不需要
     * 在这里在写副作用操作
     */
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
      areaId: "",
      businessType: "",
      validStatus: "",
    });
  };

  const tableSelectChange = (selectedRowKeys, selectedRows, info) => {
    /**
     * 当前选择了这一行，但是可能不是立即删除
     * 所以我们可以把他放到外部
     * 需要的时候直接获取
     *
     */
    setDelIds(selectedRowKeys);
  };

  const handleOk = async () => {
    // 返回所有值
    const data = insertForm.getFieldsValue(true);
    /**
     * 转换参数
     * 把参数转换成后端想要的格式
     */
    if (data.validTime) {
      // 开始时间
      data.validStartTime = formatDate(data.validTime[0]);
      // 结束时间
      data.validEndTime = formatDate(data.validTime[1]);
    }

    // 调用创建接口进行创建
    await API[insertForm.id ? "updateCompany" : "createCompany"](data);

    // 重新调用列表接口,重置页码为1
    setFilterParams({ ...filterParams, page: 1 });

    setIsModalOpen(false);
    message.success("成功");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Space>
        <Button onClick={getCompany}>刷新</Button>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          新增
        </Button>
        <Button onClick={() => del()} danger disabled={delIds.length === 0}>
          删除
        </Button>
        <Form form={form} layout="inline" onFinish={searchData}>
          <Form.Item label="所属辖区" name="areaId">
            <Select
              style={{
                width: 80,
              }}
              options={[{ label: "全部", value: "" }, ...areas]}
            />
          </Form.Item>
          <Form.Item label="经营类型" name="businessType">
            <Select
              style={{
                width: 80,
              }}
              options={[{ label: "全部", value: "" }, ...businessTypes]}
            />
          </Form.Item>
          <Form.Item label="许可状态" name="validStatus">
            <Select
              style={{
                width: 80,
              }}
              options={[{ label: "全部", value: "" }, ...validStatus]}
            />
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
          onChange: tableSelectChange,
          selectedRowKeys: delIds,
        }}
        style={{ marginTop: "20px" }}
        columns={columns}
        dataSource={tableData}
      />
      <Modal
        title="创建"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={insertForm}>
          <Form.Item label="所属辖区" name="areaId">
            <Select options={[...areas]} />
          </Form.Item>
          <Form.Item label="经营类型" name="businessType">
            <Select options={[...businessTypes]} />
          </Form.Item>
          <Form.Item label="门店名称" name="storeName">
            <Input />
          </Form.Item>
          <Form.Item label="许可证有效期" name="validTime">
            <RangePicker />
          </Form.Item>
          <Form.Item label="门头照片" name="sotreImage">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
