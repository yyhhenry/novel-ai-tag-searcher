import { contextBridge, ipcRenderer } from 'electron';
import type { WholeRemote } from './bridge';

type DefOf<T extends {} = {}> = {
    [Key in keyof T]: 0;
};
const invokerOf = <T extends keyof WholeRemote>(
    name: T,
    list: DefOf<WholeRemote[T]>
) => {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(list)) {
        result[key] = (...args: unknown[]) =>
            ipcRenderer.invoke(`${name}.${key}`, ...args);
    }
    return result as WholeRemote[T];
};
const templateName = invokerOf('templateName', {
    templateName: 0,
});
const remote: WholeRemote = { templateName };
for (const [key, value] of Object.entries(remote)) {
    contextBridge.exposeInMainWorld(key, value);
}