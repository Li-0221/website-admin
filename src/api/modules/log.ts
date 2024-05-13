import http from "@/api";

// 列表
export const logList = (params: Object) => {
  return http.post<any>(`/log/list`, params);
};

// 新增
export const addLog = (params: Object) => {
  return http.post(`/log/create`, params);
};

// 编辑
export const editLog = (params: Object) => {
  return http.post(`/log/edit`, params);
};

// 删除
export const deleteLog = (id: string) => {
  return http.delete(`/log/${id}`);
};
