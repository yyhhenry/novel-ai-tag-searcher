import { openDB, DBSchema } from 'idb';
import { ref, watch } from 'vue';
export interface NovelAITagSearcherDB extends DBSchema {
    history: {
        key: 'list';
        value: string[];
    };
}
export const dbName = 'novel-ai-tag-searcher';
export const db = await openDB<{
    history: {
        key: 'list';
        value: string[];
    };
}>(dbName, undefined, {
    upgrade: db => {
        db.createObjectStore('history');
    },
});
