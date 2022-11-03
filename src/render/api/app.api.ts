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
 * 获取应用设置
 */
export function getAppSettings() {
    return ipcInstance.send<Result>(channel.app.getAppSettings)
}

/**
 * 写入应用设置
 * @param setup
 */
export function setAppSettings(setup) {
    return ipcInstance.send<Result>(channel.app.setAppSettings, setup)
}

/**
 * 更新登录模式
 * @param setup
 */
export function setLoginMode(setup) {
    return ipcInstance.send<Result>(channel.app.setLoginMode, setup)
}

/**
 * 应用重启
 */
export function appRelaunch() {
    return ipcInstance.send(channel.app.relaunch)
}

/**
 * 应用网络代理设置
 */
export function setProxy(setup) {
    return ipcInstance.send<Result>(channel.app.setProxy,setup)
}

/**
 * 获取网络代理设置
 */
export function getAppProxySettings(){
    return ipcInstance.send<Result>(channel.app.getAppProxySettings)
}

