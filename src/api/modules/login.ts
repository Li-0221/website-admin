import { Login } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import authMenuList from "@/assets/json/authMenuList.json";
import authButtonList from "@/assets/json/authButtonList.json";
import http from "@/api";

export const loginApi = (params: Login.ReqLoginForm) => {
  return http.post<Login.ResLogin>(`/auth/admin`, params, { loading: false }); // 正常 post json 请求  ==>  application/json
};

export const getAuthMenuListApi = () => {
  return authMenuList;
};

export const getAuthButtonListApi = () => {
  return http.get<Login.ResAuthButtons>(PORT1 + `/auth/buttons`, {}, { loading: false });
  return authButtonList;
};
