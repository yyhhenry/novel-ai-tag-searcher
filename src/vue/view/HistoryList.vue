<script setup lang="ts">
import { tagHistoryList, removeHistory } from '@/util/tagHistoryList';
import { ElButton } from 'element-plus';
defineProps<{
  input: string;
}>();
defineEmits<{
  (event: 'update:input', value: string): void;
}>();
</script>
<template>
  <h2>历史记录</h2>
  <p style="color: gray">(右键删除)</p>
  <div
    v-for="tag of tagHistoryList"
    style="padding: 5px; display: inline-block"
  >
    <ElButton
      :plain="true"
      @click="() => $emit('update:input', tag)"
      @contextmenu="() => removeHistory(tag)"
    >
      {{ tag }}
    </ElButton>
  </div>
</template>
