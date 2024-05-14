<template>
  <div class="h-full">
    <div class="card !pb-0 mb-2 flex">
      <el-form :inline="true" :model="form" label-width="auto" ref="searchFormRef" class="flex-1">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="昵称" prop="name">
              <el-input v-model="form.name" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择" clearable>
                <el-option label="正常" value="Normal" />
                <el-option label="禁用" value="Disabled" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="角色" prop="role">
              <el-select v-model="form.role" placeholder="请选择" clearable>
                <el-option label="VIP用户" value="VIP_USER" />
                <el-option label="普通用户" value="NORMAL_USER" />
              </el-select>
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
            <el-form-item label="登录时间" prop="lastLoginAt">
              <el-date-picker
                v-model="form.lastLoginAt"
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

      <div class="flex-col flex ml-8">
        <el-button type="primary" :icon="Search" @click="getList(true)"> 搜索 </el-button>
        <el-button :icon="Delete" class="!ml-0 mt-[18px]" @click="onReset(searchFormRef)"> 重置 </el-button>
      </div>
    </div>
    <div class="h-[calc(100%-122px)]">
      <ProTable ref="proTable" :tool-button="false" :data="tableData" :columns="columns">
        <template #operation="{ row }">
          <el-button type="primary" link @click="editUserRef?.openDialog(row)"> 编辑 </el-button>
          <el-button type="danger" link @click="delUser(row.id)">删除</el-button>
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
    <EditUser ref="editUserRef" @refresh-list="getList()" />
  </div>
</template>

<script lang="tsx" setup>
import { onMounted, reactive, ref } from "vue";
import { deleteUserApi, getUserList } from "@/api/modules/user";
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import dayjs from "dayjs";
import { Delete, Search } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import { statusEnum } from "@/enums/userEnum";
import EditUser from "./components/EditUser.vue";

const editUserRef = ref<InstanceType<typeof EditUser>>();
const proTable = ref<ProTableInstance>();
const searchFormRef = ref<FormInstance>();
const total = ref(0);
const tableData = ref([]);
const pagination = reactive({
  pageSize: 25,
  pageNum: 1
});
const form = reactive({
  name: "",
  phone: "",
  role: "",
  status: "",
  createdAt: ["", ""],
  lastLoginAt: ["", ""]
});

const columns = reactive<ColumnProps[]>([
  {
    prop: "name",
    label: "用户昵称"
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

const getList = async (resetPage = false) => {
  if (resetPage) pagination.pageNum = 1;
  const { data } = await getUserList({ ...form, ...pagination });
  tableData.value = data.users;
  total.value = data.total;
};

const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getList(true);
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

onMounted(() => {
  getList();
});
</script>
