<template>
  <div class="h-full">
    <div class="card !pb-0 mb-2 flex">
      <el-form :inline="true" :model="form" label-width="auto" ref="searchFormRef" class="flex-1">
        <el-row :gutter="20">
          <el-col :span="9">
            <el-form-item label="软件名称" prop="title">
              <el-input v-model="form.title" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="软件分类" prop="softWareTypeId">
              <el-select v-model="form.softwareTypeId" placeholder="请选择" clearable>
                <el-option :label="item.name" :value="item.id" v-for="item in softwareTypeOption" :key="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="flex">
        <el-button type="primary" :icon="Search" @click="getList(true)"> 搜索 </el-button>
        <el-button :icon="Delete" @click="onReset(searchFormRef)"> 重置 </el-button>
      </div>
    </div>
    <div class="h-[calc(100%-72px)]">
      <ProTable ref="proTable" :tool-button="false" :data="tableData" :columns="columns">
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="createSoftware">新增软件</el-button>
        </template>
        <template #operation="{ row }">
          <el-button type="primary" link @click="editSoftwareRef?.openDialog(row)">编辑</el-button>
          <el-button type="danger" link @click="del(row.id)">删除</el-button>
        </template>
        <template #pagination>
          <!-- TODO     @current-change="getList()" 这里导致list被多请求了一次-->
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
    <EditSoftware ref="editSoftwareRef" :software-type-option="softwareTypeOption" @refresh-list="getList(true)" />
  </div>
</template>

<script lang="tsx" setup>
import { onMounted, reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import dayjs from "dayjs";
import { Delete, Search, CirclePlus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import { deleteSoftware, softwareList, softwareTypeList } from "@/api/modules/software";
import EditSoftware from "./components/EditSoftware.vue";

interface SoftwareType {
  id: string;
  name: string;
}
const baseUrl = import.meta.env.VITE_API_URL;

const editSoftwareRef = ref<InstanceType<typeof EditSoftware>>();
const proTable = ref<ProTableInstance>();
const searchFormRef = ref<FormInstance>();
const total = ref(0);
const tableData = ref([]);
const softwareTypeOption = ref<SoftwareType[]>([]);
const pagination = reactive({
  pageSize: 25,
  pageNum: 1
});
const form = reactive({
  title: "",
  softwareTypeId: "",
  createdAt: ["", ""],
  updatedAt: ["", ""]
});

const columns = reactive<ColumnProps[]>([
  {
    prop: "title",
    label: "软件名称"
  },
  {
    prop: "image",
    label: "封面图",
    render: ({ row }) => {
      return (
        <el-image
          src={baseUrl + row.image}
          zoom-rate={1.2}
          max-scale={7}
          min-scale={0.2}
          preview-src-list={[baseUrl + row.image]}
          initial-index={4}
          preview-teleported
          z-index={99999}
          fit="cover"
        />
      );
    }
  },
  {
    prop: "desc",
    label: "简介"
  },
  {
    prop: "updatedAt",
    label: "登录时间",
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

const getTypeList = async () => {
  const { data } = await softwareTypeList();
  softwareTypeOption.value = data;
};

const getList = async (resetPage = false) => {
  if (resetPage) pagination.pageNum = 1;
  const { data } = await softwareList({ ...form, ...pagination });
  tableData.value = data.softwares;
  total.value = data.total;
};

const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getList(true);
};

const del = (id: string) => {
  ElMessageBox.confirm("此操作将永久删除该软件, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    await deleteSoftware(id);
    ElMessage.success("删除成功");
    getList();
  });
};

const createSoftware = () => {
  editSoftwareRef.value?.openDialog();
};

onMounted(() => {
  getList();
  getTypeList();
});
</script>
