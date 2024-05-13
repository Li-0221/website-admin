import http from "@/api";

interface Stats {
  today: number;
  history: number;
}

// 获取财务列表
export const financeListApi = (params: Object) => {
  return http.post<any>(`/finance/list`, params);
};

// 获取统计数据
export const financeCountApi = () => {
  return http.get<Stats>(`/finance/count`);
};
