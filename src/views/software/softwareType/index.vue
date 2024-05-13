<template>
  <div class="h-full">
    <ProTable ref="proTable" :tool-button="false" :data="tableData" :columns="columns" :pagination="false">
      <template #operation="{ row }">
        <el-button type="primary" link @click="editUser(row.id)">编辑 </el-button>
        <el-button type="danger" link @click="delType(row.id)">删除</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script lang="tsx" setup>
import { onMounted, reactive, ref } from "vue";
import { deleteUserApi, editUserApi } from "@/api/modules/user";
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import dayjs from "dayjs";
import { ElMessage, ElMessageBox } from "element-plus";
import { statusEnum } from "@/enums/userEnum";
import { softwareTypeList } from "@/api/modules/software";

const proTable = ref<ProTableInstance>();
const tableData = ref([]);

const columns = reactive<ColumnProps[]>([
  {
    prop: "name",
    label: "分类名称"
  },
  {
    prop: "role",
    label: "状态",
    render: ({ row }) => {
      return (
        <el-tag type={row.role === "VIP_USER" ? "primary" : "info"}>{row.role === "VIP_USER" ? "VIP用户" : "普通用户"}</el-tag>
      );
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

const getList = async () => {
  const { data } = await softwareTypeList();
  tableData.value = data;
};

const editUser = async (id: string, status: string) => {
  await editUserApi({ id, type: status });
  ElMessage.success("操作成功");
  getList();
};

const delType = (id: string) => {
  ElMessageBox.confirm("此操作将永久删除该分类, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    await deleteUserApi(id);
    ElMessage.success("删除成功");
    getList();
  });
};

onMounted(() => {
  getList();
});
</script>
