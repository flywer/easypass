import {ipcInstance} from '@render/plugins'

//设置主窗体 最大化、最小化、关闭
export function setWindow(msg: string) {
    return ipcInstance.send<string>('set-window', msg)
}