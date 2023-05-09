import { HashRouter, Routes, Route } from "react-router-dom";
import React from "react";
import { Spin } from "antd";
import { useMenus } from "./layout/layout.hooks";

const Login = React.lazy(() => import("./pages/login/login"));
const App = React.lazy(() => import("./layout/layout"));

export default function Router() {
  return (
    <React.Suspense fallback={<Spin />}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/*" element={<App />}></Route>
        </Routes>
      </HashRouter>
    </React.Suspense>
  );
}
