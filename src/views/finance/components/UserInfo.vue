<template>
  <el-dialog v-model="dialogVisible" title="资金信息" width="500px">
    <el-descriptions title="资金信息" :column="1" border>
      <el-descriptions-item label="ID">{{ infoData.id }}</el-descriptions-item>
      <el-descriptions-item label="金额">{{ infoData.amount }}</el-descriptions-item>
      <el-descriptions-item label="时间">{{ infoData.createdAt }}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="用户信息" :column="1" border class="mt-5">
      <el-descriptions-item label="ID">{{ infoData.User.id }}</el-descriptions-item>
      <el-descriptions-item label="名称">{{ infoData.User.name }}</el-descriptions-item>
      <el-descriptions-item label="电话">{{ infoData.User.phone }}</el-descriptions-item>
      <el-descriptions-item label="状态">
        <el-tag :type="statusEnum[infoData.User.status].type">{{ statusEnum[infoData.User.status].text }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="上次登陆">
        {{ dayjs(infoData.User.lastLoginAt).format("YYYY-MM-DD HH:mm:ss") }}
      </el-descriptions-item>
      <el-descriptions-item label="登陆次数">{{ infoData.User.loginCount }}</el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";
import { statusEnum } from "@/enums/userEnum";

const infoData = ref<any>({});

const dialogVisible = ref(false);
const openDialog = (data: object) => {
  infoData.value = data;
  dialogVisible.value = true;
};

defineExpose({ openDialog });
</script>
