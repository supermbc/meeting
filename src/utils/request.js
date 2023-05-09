import axios from "axios";
import { message } from "antd";

/**
 * 可以写一个对象使用环境变量来区分环境
 */

const urlConfing = {
  dev: "wwww.dev.com",
  uat: "wwww.uat.com",
  prod: "wwww.prod.com",
};

console.log("当前环境", urlConfing[import.meta.env.VITE_SOME_KEY])

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers["Authorization"] = token;
  return config;
});

axios.interceptors.response.use(
  (response) => {
    // 和后端协商，非1000的code都是错误的请求
    if (response.data.code !== 1000) {
      // 提示报错信息
      message.error(response.data.message);
      // 抛出错误，阻塞后续代码运行
      throw new Error(response.data.messageƒ);
    }

    // 为什么方便视图使用，在这里解构
    return response.data.data;
  },
  (err) => {
    if (err.response.status === 401) {
      message.error("登录失效，请重新登陆~");
      localStorage.clear();
      location.href = location.origin + "/#/login";
    }
  }
);

export default axios;
