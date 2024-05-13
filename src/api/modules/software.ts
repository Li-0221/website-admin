import http from "@/api";

// 获取软件分类列表
export const softwareTypeList = () => {
  return http.post<any>(`/software-type`);
};

// 新增分类
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

// 获取软件列表
export const softwareList = (params: Object) => {
  return http.post<any>(`/software/list`, params);
};

// 新增软件
export const addSoftware = (params: Object) => {
  return http.post(`/software/create`, params);
};

// 编辑软件
export const editSoftware = (params: Object) => {
  return http.post(`/software/edit`, params);
};

// 删除
export const deleteSoftware = (id: string) => {
  return http.delete(`/software/${id}`);
};
