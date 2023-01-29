export interface Instance {
    english: string;
    chinese: string;
    frequency: number;
}
export interface TagList {
    tags: string[];
    chinese: string;
}
export interface TagData {
    instances: Instance[];
    tagLists: TagList[];
}
const isObject = <T extends {} = {}>(v: unknown): v is { [key in keyof T]?: unknown; } => {
    return typeof v === 'object' && v !== null;
};
const isTArray = <T,>(v: unknown, isT: (element: unknown) => element is T): v is T[] => {
    return Array.isArray(v) && v.every(element => isT(element));
};
export const isInstance = (v: unknown): v is Instance => {
    return isObject<Instance>(v) && typeof v.chinese === 'string' && typeof v.english === 'string' && typeof v.frequency === 'number';
};
export const isTagList = (v: unknown): v is TagList => {
    return isObject<TagList>(v) && typeof v.chinese === 'string' && isTArray(v.tags, (s: unknown): s is string => typeof s === 'string');
};
export const isTagData = (v: unknown): v is TagData => {
    return isObject<TagData>(v) && isTArray(v.instances, isInstance) && isTArray(v.tagLists, isTagList);
};
