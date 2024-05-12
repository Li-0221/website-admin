<template>
  <el-dialog v-model="dialogVisible" title="个人信息" width="500px" draggable>
    <el-form :inline="true" :model="form" label-width="auto" ref="searchFormRef">
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择" clearable>
          <el-option label="正常" value="Normal" />
          <el-option label="禁用" value="Disabled" />
          <el-option label="已删除" value="Delete" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

const form = reactive({
  name: "",
  phone: "",
  role: "",
  status: "",
  createdAt: ["", ""],
  lastLoginAt: ["", ""]
});
const dialogVisible = ref(false);
const openDialog = (data: object) => {
  console.log(data);

  dialogVisible.value = true;
};

defineExpose({ openDialog });
</script>
