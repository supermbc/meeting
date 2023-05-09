import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Avatar, Dropdown, Space, Button } from "antd";
import React, { useState } from "react";
const { Header, Sider, Content } = Layout;
import { useNavigate, useRoutes, useLocation } from "react-router-dom";
import useAfterEach from "./../utils/afterEach";

const NotFound = React.lazy(() => import("./../pages/notFound/notFound"));

import { getMenus } from "./layout.config";
import "./layout.scss";
const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();

  const [navs, setNavs] = useState([]);

  const location = useLocation();

  const getMenusName = (path) => {
    let name = "";

    const find = (menus = getMenus()) => {
      menus.forEach((item) => {
        if (item.path === path) {
          name = item.label;
          return;
        }

        if (item.children) {
          find(item.children);
        }
      });
    };

    find();

    return name;
  };

  /**
   * 这个hooks 是每次layout变化后才会改变
   * 那么我们如果在layout里面执行setState的操作
   * 组件会重新渲染，那么useAfterEach也会执行
   */
  useAfterEach(() => {
    console.log("每次变化都会触发", location);
    /**
     * 面包屑不能重复
     * 如果重复跳转，当前面包屑高亮
     */

    /**
     * 用讨巧的做法
     * 直接改变原数据
     * 那么下面在更新的时候就会使用这个数据
     */
    navs.forEach((item) => {
      item.active = false;
    });

    // 获取当前面包屑的下标
    const currentNavIndex = navs.findIndex(
      (item) => item.path === location.pathname
    );

    // 重复了
    if (currentNavIndex !== -1) {
      const currentNavs = [...navs];

      // 找到当前属性让他高亮
      currentNavs[currentNavIndex].active = true;

      setNavs([...currentNavs]);
    } else {
      setNavs([
        ...navs,
        {
          label: getMenusName(location.pathname),
          path: location.pathname,
          active: true,
        },
      ]);
    }
  });

  const items = [
    {
      label: "退出登录",
      key: "0",
    },
  ];

  /**
   * 获取当前有权限的菜单
   */
  const getCurrentMenus = (menus = getMenus()) => {
    /**
     * 使用当前登录的角色和菜单角色作对比
     */

    // 当前登录角色
    const roles = JSON.parse(localStorage.getItem("roles"));

    return menus.filter((item) => {
      if (item.children) {
        item.children = getCurrentMenus(item.children);
      }

      // 当前菜单数据
      /**
       * 我们使用some去分别给每一个角色做判断
       * 只要有一个角色在登录返回的数组里，那么这个
       * 菜单就可以显示
       */
      return item.roles.some((is) => roles?.includes(is));
    });
  };

  /**
   * useRoutes这个方法进行动态路由渲染
   * 接收一个数组，数组里面是路由对象
   * 返回一个路由组件，可以直接使用
   */
  const routerComponent = useRoutes(getCurrentMenus());

  const linkPage = ({ key }) => {
    navigate(key);
  };

  /**
   * 当前事件会存在冒泡的问题
   * @param {} index
   */
  const delNav = (index, event) => {
    // 取消冒泡
    event.stopPropagation();
    //
    /**
     * 删除当前点击的元素
     * 并拿到删除的元素
     * 注意：删除后返回一个数组
     */
    const [delItem] = navs.splice(index, 1);

    // 如果删除的是高亮导航，那么默认跳转到最后一个
    if (delItem.active) {
      // 跳转到最后一个
      navigate(navs[navs.length - 1].path);
    }

    setNavs([...navs]);
    console.log(index, event);
  };

  return (
    /**
     * css 通过 bem
     * 这种规范
     * b_e__m
     */
    <Layout className="layout-box" id="components-layout-demo-custom-trigger">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          onClick={linkPage}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={getCurrentMenus()}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <div className="header-box">
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
            <Dropdown
              menu={{
                items,
                onClick: () => {
                  localStorage.clear();
                  navigate("/login");
                },
              }}
              trigger={["click"]}
            >
              <Avatar size={32} icon={<UserOutlined />} />
            </Dropdown>
          </div>
        </Header>
        <Space className="navs-box">
          {navs.map((item, index) => (
            <Button
              onClick={() => navigate(item.path)}
              key={index}
              type={item.active ? "primary" : "dashed"}
            >
              {item.label}
              {navs.length !== 1 && (
                <CloseCircleOutlined
                  onClick={(event) => delNav(index, event)}
                />
              )}
            </Button>
          ))}
        </Space>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          {routerComponent}
        </Content>
      </Layout>
    </Layout>
  );
};
export default App;
