
import { tagData } from "./tagData";
import type { Instance, TagList } from "./TagDataDeclaration";
/**
 * 编辑距离，仅仅取前10位
 * 且遇到需要删改的编辑距离会增大到5
 * 普通添加的代价为1
 * 与目标串的前缀相似则剩余部分代价为0.2
 */

export const editDistance = (current: string, target: string) => {
    const appendCost = 0.2;
    current = current.substring(0, 10);
    target = target.substring(0, 10);
    const solve: number[][] = [];
    for (let i = 0; i <= current.length; i++) {
        solve.push([]);
        for (let j = 0; j <= target.length; j++) {
            solve[i].push(Infinity);
        }
    }
    solve[0][0] = 0;
    for (let i = 0; i <= current.length; i++) {
        for (let j = i > 0 ? 0 : 1; j <= target.length; j++) {
            if (i > 0 && j > 0) {
                solve[i][j] = solve[i - 1][j - 1] + (current[i - 1] === target[j - 1] ? 0 : 1 / appendCost);
            }
            if (i > 0) {
                solve[i][j] = Math.min(solve[i][j], solve[i - 1][j] + 1 / appendCost);
            }
            if (j > 0) {
                solve[i][j] = Math.min(solve[i][j], solve[i][j - 1] + (i === current.length ? appendCost : 1));
            }
        }
    }
    return solve[current.length][target.length];
};
export const balancedCost = (current: string, target: string, frequency: number) => {
    return editDistance(current, target) / Math.log(frequency);
};
export const costToInstance = (current: string, target: Instance) => {
    return Math.min(...[target.english, target.chinese].map(s => balancedCost(current, s, target.frequency)));
};
export const costToTagList = (current: string, target: TagList) => {
    const defaultFrequency = 2000;
    return Math.min(...[target.tags.join(','), target.chinese].map(s => balancedCost(current, s, defaultFrequency)));
};
export const sorted = <T>(array: T[], front: (a: T, b: T) => boolean): T[] => {
    if (array.length <= 1) {
        return array;
    }
    const x = array[Math.floor(Math.random() * array.length)];
    const leftPart = array.filter(v => front(v, x));
    const midPart = array.filter(v => !front(v, x) && !front(x, v));
    const rightPart = array.filter(v => front(x, v));
    return [...sorted(leftPart, front), ...midPart, ...sorted(rightPart, front)];
};
export const topSpecifiedNumberOfElements = <T>(array: T[], n: number, front: (a: T, b: T) => boolean): T[] => {
    const topNth = <T>(array: T[], nth: number, front: (a: T, b: T) => boolean): T[] => {
        if (array.length <= 1) {
            return array;
        } else if (array.length <= nth) {
            return sorted(array, front);
        }
        const x = array[Math.floor(Math.random() * array.length)];
        const leftPart = array.filter(v => front(v, x));
        const midPart = array.filter(v => !front(v, x) && !front(x, v));
        const rightPart = array.filter(v => front(x, v));
        if (nth < leftPart.length) {
            return [...topNth(leftPart, nth, front)];
        } else if (nth - leftPart.length < midPart.length) {
            return [...sorted(leftPart, front), ...midPart.slice(0, nth - leftPart.length + 1)];
        } else {
            return [...sorted(leftPart, front), ...midPart, ...topNth(rightPart, nth - leftPart.length - midPart.length, front)];
        }
    };
    return topNth(array, n - 1, front);
};
export interface InstanceCost extends Instance {
    cost: number;
}
export interface TagListCost extends TagList {
    cost: number;
}
export interface TagDataCost {
    instances: InstanceCost[];
    tagLists: TagListCost[];
}
export const getSimilars = (current: string): TagDataCost => {
    current = current.trim();
    if (tagData.value && current.length >= 1) {
        const instanceCosts: InstanceCost[] = tagData.value.instances.map(instance => {
            return { ...instance, cost: costToInstance(current, instance) };
        });
        const tagListCosts: TagListCost[] = tagData.value.tagLists.map(tagList => {
            return { ...tagList, cost: costToTagList(current, tagList) };
        });
        return {
            instances: topSpecifiedNumberOfElements(instanceCosts, 10, (a, b) => a.cost < b.cost),
            tagLists: topSpecifiedNumberOfElements(tagListCosts, 5, (a, b) => a.cost < b.cost),
        };
    }
    return { instances: [], tagLists: [] };
};
