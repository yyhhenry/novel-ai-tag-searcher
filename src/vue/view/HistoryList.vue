<script setup lang="ts">
import { tagHistoryList, removeHistory } from '@/util/tagHistoryList';
import { ElButton, ElAside, ElRow } from 'element-plus';
defineProps<{
  input: string;
}>();
defineEmits<{
  (event: 'update:input', value: string): void;
}>();
</script>
<template>
  <ElAside class="aside">
    <ElRow :align="'bottom'">
      <h2 class="title">历史记录</h2>
      <span class="info">(右键删除)</span>
    </ElRow>
    <ElRow>
      <ElButton
        v-for="tag of tagHistoryList"
        :plain="true"
        class="button"
        @click="() => $emit('update:input', tag)"
        @contextmenu="() => removeHistory(tag)"
      >
        {{ tag }}
      </ElButton>
    </ElRow>
    <span class="bottom-info">
      推荐使用Win11深色模式
    </span>
  </ElAside>
</template>
<style lang="scss" scoped>
.title {
  color: var(--color-heading);
}
.info {
  color: var(--color-text);
}
.aside {
  background-color: var(--color-background-mute);
  padding: 15px;
  overflow-x: hidden;
}
.button {
  margin: 5px;
}
.bottom-info {
  @extend .info;
  position: absolute;
  bottom: 0%;
}
</style>
