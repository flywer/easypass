import {ipcInstance} from '@render/plugins'

//设置主窗体 最大化、最小化、关闭
export function setWindow(setup: string) {
    return ipcInstance.send<string>('set-window', setup)
}

//设置开机自启
export function setOpenAtLogin(setup: boolean) {
    return ipcInstance.send<string>('set-openAtLogin', setup)
}

//获取开机自启配置
export function getOpenAtLogin(){
    return ipcInstance.send<boolean>('get-openAtLogin')
}
