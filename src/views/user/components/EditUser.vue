<template>
  <el-dialog v-model="dialogVisible" title="用户信息" width="550px" destroy-on-close @close="resetForm()">
    <el-form :model="form" label-width="auto" ref="formRef" :rules="rules">
      <el-form-item label="用户名称" prop="name" disabled>
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择" clearable>
          <el-option label="正常" value="Normal" />
          <el-option label="禁用" value="Disabled" />
        </el-select>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="form.role" placeholder="请选择" clearable>
          <el-option label="VIP用户" value="VIP_USER" />
          <el-option label="普通用户" value="NORMAL_USER" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onSubmit(formRef)">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage, FormInstance, FormRules, UploadProps } from "element-plus";
import { editUserApi } from "@/api/modules/user";

const emit = defineEmits(["refreshList"]);

const formRef = ref<FormInstance>();
const dialogVisible = ref(false);
const form = reactive({
  id: "",
  name: "",
  status: "",
  role: ""
});

const rules = reactive<FormRules>({
  status: [{ required: true, message: "请选择", trigger: "change" }],
  role: [{ required: true, message: "请选择", trigger: "change" }]
});

const resetForm = () => {
  Object.keys(form).forEach(k => {
    form[k] = "";
  });
};

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async valid => {
    if (valid) {
      await editUserApi(form);
      ElMessage.success("操作成功");
      emit("refreshList");
      dialogVisible.value = false;
    }
  });
};

const onCancel = () => {
  resetForm();
  dialogVisible.value = false;
};

const openDialog = (data?: any) => {
  if (data) {
    Object.keys(form).forEach(k => {
      form[k] = data[k];
    });
  }
  dialogVisible.value = true;
};

defineExpose({ openDialog });
</script>
