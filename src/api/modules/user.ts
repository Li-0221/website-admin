import http from "@/api";

// 获取用户列表
export const getUserList = (params: Object) => {
  return http.post<any>(`/user/list`, params);
};

// 编辑用户
export const editUserApi = (params: Object) => {
  return http.post(`/user/edit`, params);
};

// 删除用户
export const deleteUserApi = (id: string) => {
  return http.delete(`/user/${id}`);
};
