<template>
  <div class="h-full">
    <div class="card !pb-0 mb-2">
      <div class="flex">
        <div class="today-traffic traffic-box">
          <div class="traffic-img">
            <img src="./images/today.png" alt="" />
          </div>
          <div class="flex flex-col">
            <span class="item-value">{{ stats.today }}</span> <span class="traffic-name sle">今日流水</span>
          </div>
        </div>
        <div class="yesterday-traffic traffic-box ml-20">
          <div class="traffic-img">
            <img src="./images/book_sum.png" alt="" />
          </div>
          <div class="flex flex-col">
            <span class="item-value">{{ stats.history }}</span> <span class="traffic-name sle">历史流水</span>
          </div>
        </div>
      </div>
      <el-tabs v-model="tabActive" class="demo-tabs" @tab-change="tabChange">
        <el-tab-pane label="今日流水" name="today"></el-tab-pane>
        <el-tab-pane label="历史流水" name="history"></el-tab-pane>
      </el-tabs>

      <div class="flex">
        <el-form :inline="true" :model="form" label-width="auto" ref="searchFormRef" class="flex-1">
          <el-row :gutter="20">
            <el-col :span="9">
              <el-form-item label="用户姓名" prop="name">
                <el-input v-model="form.name" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="9" v-if="tabActive === 'history'">
              <el-form-item label="创建时间" prop="createdAt">
                <el-date-picker
                  v-model="form.createdAt"
                  type="daterange"
                  value-format="YYYY-MM-DD"
                  range-separator="To"
                  start-placeholder="Start date"
                  end-placeholder="End date"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div class="flex">
          <el-button type="primary" :icon="Search" @click="getList(true)"> 搜索 </el-button>
          <el-button :icon="Delete" @click="onReset(searchFormRef)"> 重置 </el-button>
        </div>
      </div>
    </div>

    <div class="h-[calc(100%-234px)]">
      <ProTable ref="proTable" :tool-button="false" :data="tableData" :columns="columns">
        <template #operation="{ row }">
          <el-button type="primary" link @click="userInfoRef?.openDialog(row)"> 查看 </el-button>
        </template>
        <template #pagination>
          <el-pagination
            :background="true"
            v-model:current-page="pagination.pageNum"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 25, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="getList()"
            @current-change="getList()"
          ></el-pagination>
        </template>
      </ProTable>
    </div>
    <UserInfo ref="userInfoRef" />
  </div>
</template>

<script lang="tsx" setup>
import { onMounted, reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import dayjs from "dayjs";
import { Delete, Search } from "@element-plus/icons-vue";
import { FormInstance } from "element-plus";
import { financeCountApi, financeListApi } from "@/api/modules/finance";
import UserInfo from "./components/UserInfo.vue";

const today = dayjs().format("YYYY-MM-DD");

const userInfoRef = ref<InstanceType<typeof UserInfo>>();
const proTable = ref<ProTableInstance>();
const searchFormRef = ref<FormInstance>();
const tabActive = ref("today");
const stats = reactive({ today: 0, history: 0 });
const total = ref(0);
const tableData = ref([]);
const pagination = reactive({
  pageSize: 25,
  pageNum: 1
});
const form = reactive({
  name: "",
  createdAt: [today, today]
});

const columns = reactive<ColumnProps[]>([
  {
    prop: "User.name",
    label: "用户姓名"
  },
  {
    prop: "amount",
    label: "金额",
    sortable: true
  },
  {
    prop: "createdAt",
    label: "创建时间",
    width: 180,
    sortable: true,
    render: ({ row }) => {
      return dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 120 }
]);

const getList = async (resetPage = false) => {
  if (resetPage) pagination.pageNum = 1;
  const { data } = await financeListApi({ ...form, ...pagination });
  tableData.value = data.finances;
  total.value = data.total;
};
const getStats = async () => {
  const { data } = await financeCountApi();
  const { today, history } = data;
  stats.history = history;
  stats.today = today;
};

const tabChange = (tabPaneName: string) => {
  form.name = "";
  if (tabPaneName === "history") {
    form.createdAt = ["", ""];
    getList(true);
  } else {
    form.createdAt = [today, today];
    getList(true);
  }
};

const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getList(true);
};

onMounted(() => {
  getList();
  getStats();
});
</script>

<style lang="scss" scoped>
.traffic-box {
  box-sizing: border-box;
  display: flex;
  width: 47%;
  padding: 14px;
  justify-content: space-around;
  border-radius: 30px;
  max-width: 260px;
  .traffic-img {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 70px;
    height: 70px;
    margin-bottom: 10px;
    background-color: #ffffff;
    border-radius: 19px;
  }
}
img {
  width: 33px;
  height: 33px;
}
.item-value {
  margin-bottom: 4px;
  font-family: DIN;
  font-size: 28px;
  font-weight: bold;
  color: #1a1a37;
}
.traffic-name {
  overflow: hidden;
  font-family: DIN;
  font-size: 15px;
  color: #1a1a37;
  white-space: nowrap;
}
.today-traffic {
  background: url("./images/3-bg.png");
  background-color: #fdf3e9;
  background-size: 100% 100%;
}
.yesterday-traffic {
  background: url("./images/4-bg.png");
  background-color: #f0f5fb;
  background-size: 100% 100%;
}
</style>
