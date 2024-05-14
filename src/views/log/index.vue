<template>
  <div class="h-full">
    <div class="card !pb-0 mb-2 flex">
      <el-form :inline="true" :model="form" label-width="auto" ref="searchFormRef" class="flex-1">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="日志时间" prop="time">
              <el-date-picker
                v-model="form.time"
                type="daterange"
                value-format="YYYY-MM-DD"
                range-separator="To"
                start-placeholder="Start date"
                end-placeholder="End date"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
          <el-col :span="8">
            <el-form-item label="更新时间" prop="updatedAt">
              <el-date-picker
                v-model="form.updatedAt"
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

      <div class="flex ml-4">
        <el-button type="primary" :icon="Search" @click="getList(true)"> 搜索 </el-button>
        <el-button :icon="Delete" @click="onReset(searchFormRef)"> 重置 </el-button>
      </div>
    </div>
    <div class="h-[calc(100%-72px)]">
      <ProTable ref="proTable" :tool-button="false" :data="tableData" :columns="columns">
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="editLogRef?.openDialog()">新增日志</el-button>
        </template>
        <template #operation="{ row }">
          <el-button type="primary" link @click="editLogRef?.openDialog(row)">编辑</el-button>
          <el-button type="danger" link @click="del(row.id)">删除</el-button>
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
    <EditLog ref="editLogRef" @refresh-list="getList(true)" />
  </div>
</template>

<script lang="tsx" setup>
import { onMounted, reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import dayjs from "dayjs";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import { deleteLog, logList } from "@/api/modules/log";
import { Delete, Search, CirclePlus } from "@element-plus/icons-vue";
import EditLog from "./components/EditLog.vue";

const proTable = ref<ProTableInstance>();
const searchFormRef = ref<FormInstance>();
const editLogRef = ref<InstanceType<typeof EditLog>>();
const total = ref(0);
const tableData = ref([]);
const pagination = reactive({
  pageSize: 25,
  pageNum: 1
});
const form = reactive({
  time: ["", ""],
  createdAt: ["", ""],
  updatedAt: ["", ""]
});

const columns = reactive<ColumnProps[]>([
  {
    prop: "time",
    label: "日志时间",
    sortable: true,
    render: ({ row }) => {
      return dayjs(row.time).format("YYYY-MM-DD");
    }
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
  {
    prop: "updatedAt",
    label: "更新时间",
    width: 180,
    sortable: true,
    render: ({ row }) => {
      return row.updatedAt ? dayjs(row.updatedAt).format("YYYY-MM-DD HH:mm:ss") : "";
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 120 }
]);

const getList = async (resetPage = false) => {
  if (resetPage) pagination.pageNum = 1;
  const { data } = await logList({ ...form, ...pagination });
  tableData.value = data.logs;
  total.value = data.total;
};

const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getList(true);
};

const del = (id: string) => {
  ElMessageBox.confirm("此操作将永久删除该日志, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    await deleteLog(id);
    ElMessage.success("删除成功");
    getList();
  });
};

onMounted(() => {
  getList();
});
</script>
