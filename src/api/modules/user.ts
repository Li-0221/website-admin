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

import { ResPage, User } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
export const getUserTreeList = (params: User.ReqUserParams) => {
  return http.post<ResPage<User.ResUserList>>(PORT1 + `/user/tree/list`, params);
};
export const addUser = (params: { id: string }) => {
  return http.post(PORT1 + `/user/add`, params);
};
export const BatchAddUser = (params: FormData) => {
  return http.post(PORT1 + `/user/import`, params);
};
export const editUser = (params: { id: string }) => {
  return http.post(PORT1 + `/user/edit`, params);
};
export const deleteUser = (params: { id: string[] }) => {
  return http.post(PORT1 + `/user/delete`, params);
};
export const changeUserStatus = (params: { id: string; status: number }) => {
  return http.post(PORT1 + `/user/change`, params);
};
export const resetUserPassWord = (params: { id: string }) => {
  return http.post(PORT1 + `/user/rest_password`, params);
};
export const exportUserInfo = (params: User.ReqUserParams) => {
  return http.download(PORT1 + `/user/export`, params);
};
export const getUserStatus = () => {
  return http.get<User.ResStatus[]>(PORT1 + `/user/status`);
};
export const getUserGender = () => {
  return http.get<User.ResGender[]>(PORT1 + `/user/gender`);
};
export const getUserDepartment = () => {
  return http.get<User.ResDepartment[]>(PORT1 + `/user/department`, {}, { cancel: false });
};
export const getUserRole = () => {
  return http.get<User.ResRole[]>(PORT1 + `/user/role`);
};
