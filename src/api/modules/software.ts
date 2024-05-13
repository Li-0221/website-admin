import http from "@/api";

// 获取软件分类列表
export const softwareTypeList = () => {
  return http.get<any>(`/software-type`);
};

// 编辑分类
export const addSoftwareType = (params: Object) => {
  return http.post(`/software-type/add`, params);
};

// 编辑分类
export const editSoftwareType = (params: Object) => {
  return http.post(`/software-type/edit`, params);
};

// 删除分类
export const deleteSoftwareType = (id: string) => {
  return http.delete(`/software-type/${id}`);
};
