import {ipcInstance} from '@render/plugins'
import {channel} from "@render/api/channel";
import {Result} from "@main/vo/resultVo";
import {getAppDataPath} from "@common/utils/utils";

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
    return ipcInstance.send<Result>(channel.app.setProxy, setup)
}

/**
 * 获取网络代理设置
 */
export function getAppProxySettings() {
    return ipcInstance.send<Result>(channel.app.getAppProxySettings)
}

/**
 * 设置应用令牌
 */
export function setAppToken(token: string) {
    return ipcInstance.send<Result>(channel.app.setAppToken, token)
}

/**
 * 校验应用令牌
 * @param token
 */
export function checkAppToken(token: string) {
    return ipcInstance.send<Result>(channel.app.checkAppToken, token)
}

/**
 * 获取应用令牌信息
 */
export function getTokenSettings() {
    return ipcInstance.send<Result>(channel.app.getTokenSettings)
}

/**
 * 获取应用资源路径
 */
export function getResourceFolder() {
    return ipcInstance.send<Result>(channel.app.getResourcePath)
}

/**
 * 设置最小化时锁住应用
 * @param setup
 */
export function setAppMinSizeLock(setup: boolean) {
    return ipcInstance.send<Result>(channel.app.setAppMinSizeLock, setup)
}

/**
 * 获取包含所有与应用相关的进程的内存和CPU的使用统计
 */
export function getAppMetrics() {
    return ipcInstance.send<Result>(channel.app.getAppMetrics)
}

/**
 * 打开系统自身的emoji选取器
 */
export function showEmojiPanel() {
    return ipcInstance.send<Result>(channel.app.showEmojiPanel)
}

/**
 * 打开文件夹
 * @param path
 */
export function openPath(path: string) {
    return ipcInstance.send<Result>(channel.app.openPath)
}

/**
 * 打开AppData文件夹
 */
export function openAppDataFolder() {
    return ipcInstance.send<Result>(channel.app.openAppDataFolder)
}

/**
 * 获取AppData文件夹大小
 */
export function getAppDataFolderSize() {
    return ipcInstance.send<Result>(channel.app.getAppDataFolderSize)
}

/**
 * 打开应用资源文件夹
 */
export function openAppFolder() {
    return ipcInstance.send<Result>(channel.app.openAppFolder)
}

/**
 * 获取应用文件夹大小
 */
export function getAppFolderSize() {
    return ipcInstance.send<Result>(channel.app.getAppFolderSize)
}

/**
 * 打开应用Temp文件夹
 */
export function openAppTempDataFolder() {
    return ipcInstance.send<Result>(channel.app.openAppTempDataFolder)
}

/**
 * 获取应用Temp文件夹大小
 */
export function getAppTempDataFolderSize() {
    return ipcInstance.send<Result>(channel.app.getAppTempDataFolderSize)
}

/**
 * 应用锁屏
 */
export function lockApp() {
    return ipcInstance.send<Result>(channel.app.lockApp)
}

