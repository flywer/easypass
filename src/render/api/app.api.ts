import {ipcInstance} from '@render/plugins'
import {channel} from "@render/api/channel";
import {Result} from "@main/vo/resultVo";

/**
 * 设置主窗体 最大化、最小化、关闭
 * @param setup
 */
export function setWindow(setup: string) {
    return ipcInstance.send<string>(channel.app.setWindow, setup)
}

/**
 * 设置开机自启
 * @param setup
 */
export function setOpenAtLogin(setup) {
    return ipcInstance.send<string>(channel.app.setOpenAtLogin, setup)
}

/**
 * 获取开机自启配置
 */
export function getOpenAtLogin() {
    return ipcInstance.send<Result>(channel.app.getOpenAtLogin)
}

/**
 * 获取应用主题
 */
export function getAppTheme() {
    return ipcInstance.send<Result>(channel.app.getAppTheme)
}

/**
 * 设置应用主题
 * @param data
 */
export function setAppTheme(data) {
    return ipcInstance.send<Result>(channel.app.setAppTheme, data)
}

/**
 * 获取应用版本号
 */
export function getAppVersion() {
    return ipcInstance.send<Result>(channel.app.getAppVersion)
}

/**
 * 检查应用是否需要更新
 */
export function checkForUpdate() {
    return ipcInstance.send<Result>(channel.app.checkForUpdate)
}

/**
 * 下载更新
 */
export function downloadUpdate() {
    return ipcInstance.send<Result>(channel.app.downloadUpdate)
}

/**
 * 退出应用并安装
 */
export function quitAndInstall() {
    return ipcInstance.send<Result>(channel.app.quitAndInstall)
}

/**
 * 获取网络接口信息
 */
export function getNetworkInterfaces() {
    return ipcInstance.send<Result>(channel.app.getNetworkInterfaces)
}

/**
 * 获取应用信息
 */
export function getAppInfo() {
    return ipcInstance.send<Result>(channel.app.getAppInfo)
}

/**
 * 关闭时是否隐藏到托盘
 */
export function setCloseAsHidden(setup) {
    return ipcInstance.send<Result>(channel.app.setCloseAsHidden, setup)
}

/**
 * 获取应用设置
 */
export function getAppSettings() {
    return ipcInstance.send<Result>(channel.app.getAppSettings)
}

/**
 * 设置是否启用托盘
 * @param setup
 */
export function setEnableTray(setup) {
    return ipcInstance.send<Result>(channel.app.setEnableTray, setup)
}

