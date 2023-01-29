<script setup lang="ts">
import {
  ElMessageBox,
  ElContainer,
  ElHeader,
  ElMain,
  ElAside,
  ElDescriptions,
  ElDescriptionsItem,
  ElButton,
  ElRow,
  ElCol,
  ElInput,
  ElCard,
  ElDivider,
} from 'element-plus';
import { computed, ref, watch } from 'vue';
import type { TagDataCost } from './EditDistance';
import { getSimilars } from './EditDistance';
import type { Instance, TagList } from './TagDataDeclaration';
import TitleView from './TitleView.vue';
const input = ref('');
const usedTags = ref<Instance[]>([]);
const usedLists = ref<TagList[]>([]);
const usedHistory = ref<string[]>(
  window.localStorage.getItem('novel-ai-tag-history')?.split(',') ?? []
);
const maxHistory = 25;
const addHistory = (value: string) => {
  usedHistory.value = [
    value,
    ...usedHistory.value.filter(str => str != value),
  ].slice(0, maxHistory);
  window.localStorage.setItem(
    'novel-ai-tag-history',
    usedHistory.value.join(',')
  );
};
const removeHistory = (value: string) => {
  usedHistory.value = [...usedHistory.value.filter(str => str != value)].slice(
    0,
    maxHistory
  );
  window.localStorage.setItem(
    'novel-ai-tag-history',
    usedHistory.value.join(',')
  );
};
const beforeRemoveHistory = (value: string) => {
  ElMessageBox.confirm(`确定删除${value}吗`)
    .then(() => {
      removeHistory(value);
    })
    .catch(() => {});
};
const computedTags = computed(() => {
  return [
    ...usedLists.value.flatMap(list => list.tags),
    ...usedTags.value.map(list => list.english),
  ].join(', ');
});
const similars = ref<TagDataCost>({ instances: [], tagLists: [] });
watch(input, () => {
  const inputThisTime = input.value;
  setTimeout(() => {
    if (input.value === inputThisTime) {
      similars.value = getSimilars(input.value);
    }
  }, 300);
});
const negtiveTags =
  'lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, bad feet';
const equalInstance = (instance: Instance, other: Instance) => {
  return instance.english === other.english;
};
const addInstance = (instance: Instance) => {
  addHistory(instance.chinese);
  if (usedTags.value.some(tag => equalInstance(tag, instance))) {
    return;
  }
  usedTags.value.push(instance);
};
const removeInstance = (list: Instance) => {
  usedTags.value = usedTags.value.filter(tag => !equalInstance(tag, list));
};
const equalTagList = (list: TagList, other: TagList) => {
  return list.tags.join(', ') === other.tags.join(', ');
};
const addTagList = (list: TagList) => {
  addHistory(list.chinese);
  if (usedLists.value.some(other => equalTagList(list, other))) {
    return;
  }
  usedLists.value.push(list);
};
const removeTagList = (list: TagList) => {
  usedLists.value = usedLists.value.filter(other => !equalTagList(list, other));
};
</script>

<template>
  <TitleView title="Novel AI标签搜索" />
  <ElContainer class="full-height root">
    <ElHeader class="header">
      <h1>Novel AI标签搜索</h1>
    </ElHeader>
    <ElMain style="padding: 0px">
      <ElContainer class="full-height">
        <ElAside class="aside">
          <h2>历史记录</h2>
          <p style="color: gray">(右键删除)</p>
          <div
            v-for="tag of usedHistory"
            style="padding: 5px; display: inline-block"
          >
            <ElButton
              :plain="true"
              @click="() => (input = tag)"
              @contextmenu="() => beforeRemoveHistory(tag)"
            >
              {{ tag }}
            </ElButton>
          </div>
        </ElAside>
        <ElMain>
          <ElContainer class="full-height">
            <ElHeader height="auto" style="max-height: 50%; overflow: auto">
              <ElCard style="margin: 5px">
                <div>
                  <span style="user-select: none; color: green"> + </span>
                  <span>{{ computedTags }}</span>
                </div>
              </ElCard>
              <ElCard style="margin: 5px">
                <div>
                  <span style="user-select: none; color: green">
                    已知用法
                  </span>
                  <ElButton
                    v-for="tagList of usedLists"
                    :plain="true"
                    @click="removeTagList(tagList)"
                    style="margin: 5px"
                  >
                    <div>{{ tagList.chinese }}</div>
                    <div style="color: gray">
                      {{ tagList.tags.join(', ') }}
                    </div>
                  </ElButton>
                </div>
                <ElDivider></ElDivider>
                <div>
                  <span style="user-select: none; color: red"> 机器翻译 </span>
                  <ElButton
                    v-for="instance of usedTags"
                    :plain="true"
                    @click="removeInstance(instance)"
                    style="margin: 5px"
                  >
                    <div>{{ instance.chinese }}</div>
                    <div style="color: gray">{{ instance.english }}</div>
                  </ElButton>
                </div>
              </ElCard>
              <ElCard style="margin: 5px">
                <div>
                  <span style="user-select: none; color: red"> - </span>
                  <span>{{ negtiveTags }}</span>
                </div>
              </ElCard>
            </ElHeader>
            <ElMain
              style="
                border-style: solid;
                border-width: 3px;
                border-color: rgb(160, 235, 230);
              "
            >
              <ElInput v-model="input" placeholder="试试“高质量”?">
                <template #prepend> 双语输入 </template>
              </ElInput>
              <ElRow :gutter="20">
                <ElCol :span="12">
                  <h2>已知用法</h2>
                  <ElCard
                    v-for="tagList of similars.tagLists"
                    @click="addTagList(tagList)"
                    :shadow="'hover'"
                    style="cursor: pointer; margin: 5px"
                  >
                    <div>{{ tagList.chinese }}</div>
                    <div style="color: gray">
                      {{ tagList.tags.join(', ') }}
                    </div>
                  </ElCard>
                </ElCol>
                <ElCol :span="12">
                  <h2>机器翻译</h2>
                  <ElCard
                    v-for="instance of similars.instances"
                    @click="addInstance(instance)"
                    :shadow="'hover'"
                    style="cursor: pointer; margin: 5px"
                  >
                    <div>{{ instance.chinese }}</div>
                    <div style="color: gray">{{ instance.english }}</div>
                  </ElCard>
                </ElCol>
              </ElRow>
            </ElMain>
          </ElContainer>
        </ElMain>
      </ElContainer>
    </ElMain>
  </ElContainer>
</template>
<style scoped>
.full-height {
  height: 100%;
}
.full-height.root {
  height: 100vh;
}
.header {
  display: flex;
  align-items: center;
  background-color: rgb(68, 132, 229);
  color: white;
}

.aside {
  background-color: rgb(250, 250, 255);
}
</style>
