import React from "react";

const Company = React.lazy(() => import("../pages/company/company"));
const CulturalAuditorium = React.lazy(() =>
  import("../pages/culturalAuditorium/culturalAuditorium")
);
const Supervise = React.lazy(() => import("../pages/supervise/supervise"));
const User = React.lazy(() => import("../pages/user/user"));

export const getMenus = () => [
  {
    key: "/storeManage",
    path: "/storeManage",
    label: "门店管理",
    roles: ["inspec", "familyPartyRecord"],
    children: [
      {
        path: "/storeManage/company",
        element: <Company></Company>,
        label: "餐饮单位列表",
        key: "/storeManage/company",
        meta: { label: "餐饮单位列表" },
        roles: ["inspec"],
      },
      {
        label: "家宴中心",
        element: <CulturalAuditorium></CulturalAuditorium>,
        key: "/storeManage/culturalAuditorium",
        path: "/storeManage/culturalAuditorium",
        roles: ["familyPartyRecord"],
      },
    ],
  },
  {
    label: "监督检查",
    key: "/inspec",
    path: "/inspec",
    roles: ["inspec"],
    children: [
      {
        element: <Supervise></Supervise>,
        label: "监督检查列表",
        key: "/inspec/supervise",
        path: "/inspec/supervise",
        roles: ["inspec"],
      },
    ],
  },
  {
    label: "权限管理",
    key: "/sys",
    path: "/sys",
    roles: ["admin"],
    children: [
      {
        element: <User></User>,
        label: "用户列表",
        key: "/sys/user",
        path: "/sys/user",
        roles: ["admin"],
      },
    ],
  },
];
