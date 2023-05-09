import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./router";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";

ReactDOM.createRoot(document.getElementById("root")).render(
  /**
   * 本质上来说ConfigProvider就是creatContext返回的Provider组件
   * 然后我们可以使用它进行依赖的统一下发，比如当前统一修改语言
   */
  <ConfigProvider locale={zhCN}>
    <Router></Router>
  </ConfigProvider>
);