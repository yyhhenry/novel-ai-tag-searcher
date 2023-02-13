import { ref, watch } from 'vue';
import { db } from '@/util/Database';
import { ElMessageBox } from 'element-plus';
export const tagHistoryList = ref<string[]>(
    (await db.get('history', 'list')) ?? []
);
watch(tagHistoryList, async () => {
    await db.put('history', [...tagHistoryList.value], 'list');
});
export const maxHistory = 25;
export const addHistory = async (value: string) => {
    tagHistoryList.value = [
        value,
        ...tagHistoryList.value.filter(str => str != value),
    ].slice(0, maxHistory);
};
export const removeHistory = (value: string) => {
    ElMessageBox.confirm(`确定删除${value}吗`)
        .then(() => {
            tagHistoryList.value = [
                ...tagHistoryList.value.filter(str => str != value),
            ].slice(0, maxHistory);
        })
        .catch(() => {});
};
