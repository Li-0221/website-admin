<template>
  <el-dialog v-model="dialogVisible" title="资金信息" width="850px" @close="resetForm(formRef)">
    <el-form :model="form" label-width="auto" ref="formRef" :rules="rules">
      <el-form-item label="软件名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="封面图" prop="image">
        <el-upload class="avatar-uploader" :show-file-list="false" :before-upload="beforeAvatarUpload">
          <img v-if="form.image" :src="form.image" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input type="textarea" v-model="form.desc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="详情" prop="detail">
        <WangEditor v-model:value="form.detail" height="400px" />
      </el-form-item>
      <el-form-item label="软件分类" prop="softWareTypeId">
        <el-select v-model="form.softwareTypeId" placeholder="请选择">
          <el-option :label="item.name" :value="item.id" v-for="item in softwareTypeOption" :key="item.id" />
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
import WangEditor from "@/components/WangEditor/index.vue";
import { ElMessage, FormInstance, FormRules, UploadProps } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { addSoftware, editSoftware } from "@/api/modules/software";
interface SoftwareType {
  id: string;
  name: string;
}
interface Props {
  softwareTypeOption: SoftwareType[];
}

defineProps<Props>();
const emit = defineEmits(["refreshList"]);

const formRef = ref<FormInstance>();
const dialogVisible = ref(false);
const form = reactive({
  id: "",
  title: "",
  image: "",
  desc: "",
  detail: "",
  softwareTypeId: ""
});

const rules = reactive<FormRules>({
  title: [{ required: true, message: "请输入", trigger: "blur" }],
  image: [{ required: true, message: "请上传", trigger: "blur" }],
  desc: [{ required: true, message: "请输入", trigger: "blur" }],
  detail: [{ required: true, message: "请输入", trigger: "blur" }],
  softwareTypeId: [{ required: true, message: "请选择", trigger: "change" }]
});

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = rawFile => {
  const imageMIME = ["image/jpeg", "image/png", "image/gif"];
  if (!imageMIME.includes(rawFile.type)) {
    ElMessage.error("图片的类型必须是 JPEG PNG GIF ！");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error("图片的大小不要超过 5MB ！");
    return false;
  }

  const reader = new FileReader();
  reader.readAsDataURL(rawFile);
  reader.onload = event => {
    form.image = event.target?.result as string;
  };
  reader.onerror = error => ElMessage.error("图片读取失败");
  return true;
};

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async valid => {
    if (valid) {
      if (form.id) {
        await editSoftware(form.id ? form : { ...form, id: undefined });
        ElMessage("编辑软件成功");
      } else {
        await addSoftware(form.id ? form : { ...form, id: undefined });
        ElMessage("新增软件成功");
      }

      emit("refreshList");
    }
  });
};

const onCancel = () => {
  resetForm(formRef.value);
  dialogVisible.value = false;
};

const openDialog = () => {
  dialogVisible.value = true;
};

defineExpose({ openDialog });
</script>

<style scoped lang="scss">
:deep(.avatar-uploader) {
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .el-upload:hover {
    border-color: var(--el-color-primary);
  }
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
