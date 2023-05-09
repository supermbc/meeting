/**
 * 路由守卫
 * 每次路由变化都会触发
 */
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function useAfterEach(cb) {
  const navigate = useNavigate();
  const location = useLocation();

  const whites = ["/login"];

  /**
   * 我们使用useEffect
   * 监听location
   */
  useEffect(() => {
    if (!localStorage.getItem("token") && !whites.includes(location.pathname)) {
      // 如果没有有怎么办
      // 跳转到登录页面
      navigate("/login");
    }
    cb();
  }, [location]);
}
