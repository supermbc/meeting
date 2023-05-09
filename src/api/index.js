import request from "./../utils/request";

export default {
  login(data) {
    return request.post("/api/admin/base/open/login", data);
  },

  getUserInfo() {
    return request.get("/api/admin/base/comm/person");
  },

  getAreas() {
    return request.post("/api/admin/base/open/areas");
  },

  /**
   *
   * 获取餐饮单位列表
   */
  getCompany(data) {
    return request.post("/api/admin/storeManage/cateringCompany/page", data);
  },

  delCompany(data) {
    return request.post("/api/admin/storeManage/cateringCompany/delete", data);
  },

  createCompany(data) {
    return request.post("/api/admin/storeManage/cateringCompany/add", data);
  },

  updateCompany(data) {
    return request.post("/api/admin/storeManage/cateringCompany/update", data);
  },

  getCompanyDetail(id) {
    return request.get(`/api/admin/storeManage/cateringCompany/info?id=${id}`);
  },

  getInspec(data) {
    return request.post(`/api/admin/inspectionSupervision/inspec/page`, data);
  },
};
