import {ipcInstance} from '@render/plugins'
import {channel} from "@render/api/channel";

//设置主窗体 最大化、最小化、关闭
export function setWindow(setup: string) {
    return ipcInstance.send<string>(channel.app.setWindow, setup)
}

//设置开机自启
export function setOpenAtLogin(setup: boolean) {
    return ipcInstance.send<string>(channel.app.setOpenAtLogin, setup)
}

//获取开机自启配置
export function getOpenAtLogin(){
    return ipcInstance.send<boolean>(channel.app.getOpenAtLogin)
}
