<template>
  <el-dialog v-model="dialogVisible" title="日志信息" width="850px" destroy-on-close @close="resetForm()">
    <el-form :model="form" label-width="auto" ref="formRef" :rules="rules">
      <el-form-item label="日志名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="内容" prop="detail">
        <WangEditor v-model:value="form.detail" height="400px" />
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
import WangEditor from "@/components/WangEditor/index.vue";
import { ElMessage, FormInstance, FormRules, UploadProps } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { addSoftware, editSoftware } from "@/api/modules/software";
import { addLog, editLog } from "@/api/modules/log";
interface SoftwareType {
  id: string;
  name: string;
}

const emit = defineEmits(["refreshList"]);

const formRef = ref<FormInstance>();
const dialogVisible = ref(false);
const form = reactive({
  id: "",
  title: "",
  detail: ""
});

const rules = reactive<FormRules>({
  title: [{ required: true, message: "请输入", trigger: "blur" }],
  detail: [{ required: true, message: "请输入", trigger: "blur" }]
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
      if (form.id) {
        await editLog(form);
        ElMessage.success("编辑成功");
      } else {
        await addLog({ ...form, id: undefined });
        ElMessage.success("新增成功");
      }

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
    form.id = data.id;
    form.title = data.title;
    form.detail = data.detail;
  }
  dialogVisible.value = true;
};

defineExpose({ openDialog });
</script>
