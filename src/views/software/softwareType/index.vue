<template>
  <div class="h-full">
    <ProTable ref="proTable" :tool-button="false" :data="tableData" :columns="columns" :pagination="false">
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="createType">新增类型</el-button>
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link @click="editType(row.id, row.name)">编辑 </el-button>
        <el-button type="danger" link @click="delType(row.id)" :disabled="row.SoftWare.length !== 0">删除</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script lang="tsx" setup>
import { onMounted, reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import dayjs from "dayjs";
import { ElMessage, ElMessageBox } from "element-plus";
import { addSoftwareType, deleteSoftwareType, editSoftwareType, softwareTypeList } from "@/api/modules/software";
import { CirclePlus } from "@element-plus/icons-vue";

const proTable = ref<ProTableInstance>();
const tableData = ref([]);

const columns = reactive<ColumnProps[]>([
  {
    prop: "name",
    label: "分类名称"
  },
  {
    prop: "SoftWare",
    label: "包含软件",
    render: ({ row }) => {
      return row.SoftWare.length
        ? row.SoftWare.map(({ id, title }) => {
            return <el-tag key={id}>{title}</el-tag>;
          })
        : "";
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

const getList = async () => {
  const { data } = await softwareTypeList();
  tableData.value = data;
};

const createType = () => {
  ElMessageBox.prompt("请输入软件分类名称！", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{2,10}$/,
    inputErrorMessage: "请输入2到10个字符的有效名称"
  }).then(async ({ value }) => {
    await addSoftwareType({ name: value });
    ElMessage.success("新增成功");
    getList();
  });
};

const editType = async (id: string, name: string) => {
  ElMessageBox.prompt("请输入软件分类名称！", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputValue: name,
    inputPattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{2,10}$/,
    inputErrorMessage: "请输入2到10个字符的有效名称"
  }).then(async ({ value }) => {
    await editSoftwareType({ id, name: value });
    ElMessage.success("编辑成功");
    getList();
  });
};

const delType = (id: string) => {
  ElMessageBox.confirm("此操作将永久删除该分类, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    await deleteSoftwareType(id);
    ElMessage.success("删除成功");
    getList();
  });
};

onMounted(() => {
  getList();
});
</script>
