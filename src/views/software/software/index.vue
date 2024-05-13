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
    <div class="h-[calc(100%-122px)]">
      <ProTable ref="proTable" :tool-button="false" :data="tableData" :columns="columns">
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="createSoftware">新增软件</el-button>
        </template>
        <template #operation="{ row }">
          <el-button
            :type="row.status === 'Normal' ? 'warning' : 'primary'"
            link
            @click="editUser(row.id, row.status === 'Normal' ? 'Disabled' : 'Normal')"
          >
            {{ row.status === "Normal" ? "禁用" : "启用" }}
          </el-button>
          <el-button type="danger" link @click="delUser(row.id)">删除</el-button>
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
    <CreateSoftware ref="createSoftwareRef" :software-type-option="softwareTypeOption" @refresh-list="getList(true)" />
  </div>
</template>

<script lang="tsx" setup>
import { onMounted, reactive, ref } from "vue";
import { deleteUserApi, editUserApi } from "@/api/modules/user";
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import dayjs from "dayjs";
import { Delete, Search, CirclePlus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import { statusEnum } from "@/enums/userEnum";
import { softwareList, softwareTypeList } from "@/api/modules/software";
import CreateSoftware from "./components/CreateSoftware.vue";

interface SoftwareType {
  id: string;
  name: string;
}

const createSoftwareRef = ref<InstanceType<typeof CreateSoftware>>();
const proTable = ref<ProTableInstance>();
const searchFormRef = ref<FormInstance>();
const total = ref(0);
const tableData = ref([]);
const softwareTypeOption = ref<SoftwareType[]>([]);
const pagination = reactive({
  pageSize: 10,
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
    prop: "name",
    label: "用户姓名"
  },
  {
    prop: "phone",
    label: "电话"
  },
  {
    prop: "loginCount",
    label: "登录次数",
    sortable: true
  },
  {
    prop: "status",
    label: "状态",
    render: ({ row }) => {
      return <el-tag type={statusEnum[row.status].type}>{statusEnum[row.status].text}</el-tag>;
    }
  },
  {
    prop: "role",
    label: "角色",
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
    prop: "lastLoginAt",
    label: "登录时间",
    width: 180,
    sortable: true,
    render: ({ row }) => {
      return row.lastLoginAt ? dayjs(row.lastLoginAt).format("YYYY-MM-DD HH:mm:ss") : "";
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
  tableData.value = data.users;
  total.value = data.total;
};

const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  console.log(2);
  getList(true);
};

const editUser = async (id: string, status: string) => {
  await editUserApi({ id, type: status });
  ElMessage.success("操作成功");
};

const delUser = (id: string) => {
  ElMessageBox.confirm("此操作将永久删除该用户, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    await deleteUserApi(id);
    ElMessage.success("删除成功");
    getList();
  });
};

const createSoftware = () => {
  createSoftwareRef.value?.openDialog();
};

onMounted(() => {
  getList();
  getTypeList();
});
</script>
