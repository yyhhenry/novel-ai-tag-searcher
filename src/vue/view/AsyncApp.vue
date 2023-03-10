<script setup lang="ts">
import {
  ElContainer,
  ElHeader,
  ElMain,
  ElScrollbar,
  ElButton,
  ElRow,
  ElCol,
  ElInput,
  ElCard,
  ElDivider,
} from 'element-plus';
import HistoryList from './HistoryList.vue';
import { computed, ref, watch } from 'vue';
import type { TagDataCost } from '@/util/EditDistance';
import { getSimilars } from '@/util/EditDistance';
import type { Instance, TagList } from '@/util/TagDataDeclaration';
import TitleView from './TitleView.vue';
import { addHistory } from '@/util/tagHistoryList';
import { remote } from '@/remote';
const title = await remote.content.title();
const input = ref('');
const usedTags = ref<Instance[]>([]);
const usedLists = ref<TagList[]>([]);
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
  <TitleView :title="title" />
  <ElContainer class="full-height root">
    <ElMain style="padding: 0px">
      <ElContainer class="full-height">
        <HistoryList v-model:input="input" />
        <ElMain class="no-padding">
          <ElContainer class="full-height">
            <ElHeader height="50%" class="no-padding inner-header">
              <ElScrollbar>
                <div style="padding: 15px">
                  <ElCard class="card-margin">
                    <div>
                      <span class="user-select-none"> + </span>
                      <span>{{ computedTags }}</span>
                    </div>
                  </ElCard>
                  <ElCard class="card-margin">
                    <div>
                      <span class="user-select-none"> ???????????? </span>
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
                      <span class="user-select-none"> ???????????? </span>
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
                  <ElCard class="card-margin">
                    <div>
                      <span class="user-select-none"> - </span>
                      <span>{{ negtiveTags }}</span>
                    </div>
                  </ElCard>
                </div>
              </ElScrollbar>
            </ElHeader>
            <ElMain class="no-padding">
              <ElScrollbar>
                <div style="padding: 15px">
                  <ElInput
                    v-model="input"
                    placeholder="??????????????????????"
                    class="card-margin"
                  >
                    <template #prepend> ???????????? </template>
                  </ElInput>
                  <ElRow :gutter="20" class="card-margin">
                    <ElCol :span="12">
                      <h2>????????????</h2>
                      <ElCard
                        v-for="tagList of similars.tagLists"
                        @click="addTagList(tagList)"
                        :shadow="'hover'"
                        class="card-margin"
                        style="cursor: pointer"
                        :body-style="{
                          paddingTop: '5px',
                          paddingBottom: '5px',
                        }"
                      >
                        <div>{{ tagList.chinese }}</div>
                        <div style="color: gray">
                          {{ tagList.tags.join(', ') }}
                        </div>
                      </ElCard>
                    </ElCol>
                    <ElCol :span="12">
                      <h2>????????????</h2>
                      <ElCard
                        v-for="instance of similars.instances"
                        @click="addInstance(instance)"
                        :shadow="'hover'"
                        class="card-margin"
                        style="cursor: pointer"
                        :body-style="{
                          paddingTop: '5px',
                          paddingBottom: '5px',
                        }"
                      >
                        <div>{{ instance.chinese }}</div>
                        <div style="color: gray">{{ instance.english }}</div>
                      </ElCard>
                    </ElCol>
                  </ElRow>
                </div>
              </ElScrollbar>
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
.inner-header {
  background-color: var(--color-background-soft);
}
.no-padding {
  padding: 0px;
  margin: 0px;
}
.card-margin {
  margin: 5px;
}
.user-select-none {
  user-select: none;
}
</style>
