import { promiseHttpRequest } from './httpRequest';
import { isTagData, type TagData } from './TagDataDeclaration';
import { ref } from 'vue';
export const tagData = ref<TagData>();
const fetchTags = (frequencyLimit: number = 0) => {
    promiseHttpRequest('./aiTags.json').then(content => {
        try {
            if (content === undefined) {
                throw new Error('Cannot get aiTags.json');
            }
            const newTagData = JSON.parse(content);
            if (isTagData(newTagData)) {
                tagData.value = {
                    ...newTagData,
                    instances: newTagData.instances.filter(instance => instance.frequency >= frequencyLimit),
                };
            } else {
                throw new Error('File aiTags.json is broken');
            }
        } catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
            }
        }
    });
};
fetchTags(1e3);
