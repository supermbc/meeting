import { Tabs, Card, Form, Input, Button } from "antd";
import { useState } from "react";
import "./login.scss";
import API from "./../../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [role, setRole] = useState("inspec");

  const navigate = useNavigate();

  const onChange = (key) => {
    // console.log(key);
    setRole(key);
  };

  const login = async (values) => {
    // 调用登录接口
    const data = await API.login({ ...values, role });
    // 把token存起来
    localStorage.setItem("token", data.token);
    // 获取用户信息
    const res = await API.getUserInfo();
    // 把用户信息存起来
    localStorage.setItem("roles", JSON.stringify(res.roles));
    // 跳转到有权限的页面
    navigate(role === "inspec" ? "/storeManage/company" : "/storeManage/culturalAuditorium");
  };

  return (
    <div className="login-box">
      <Card
        style={{
          width: 400,
        }}
      >
        <h2>欢迎使用</h2>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "inspec",
              label: `监督检查管理系统`,
            },
            {
              key: "familyPartyRecord",
              label: `农村家宴管理系统`,
            },
          ]}
          onChange={onChange}
        />
        <Form onFinish={login} autoComplete="off">
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              {
                required: true,
                message: "请输入用户名",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: "请输入密码",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
