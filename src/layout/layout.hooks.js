import { getMenus } from "./layout.config";

export const useMenus = () => {
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

  return {
    currentMenus: getCurrentMenus(),
  };
};
