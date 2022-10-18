import {app} from 'electron'
import {failure, success} from "@main/vo/resultVo";
import {channel} from "@render/api/channel";

const {autoUpdater} = require("electron-updater");

const isDev = !app.isPackaged

/**
 * 自动更新处理
 */
export const handleUpdate = (window) => {
    //不启用自动更新，会在每次检测到可更新版本时自动更新
    autoUpdater.autoDownload = false

    console.log(autoUpdater.currentVersion.version)

    //开始检测更新
    autoUpdater.on('checking-for-update', async function () {
        let result = success()
        result.message = '正在检测更新...'
        result.tag = 1
        window.webContents.send(channel.app.sendUpdateInfo, result)
    });

    //当没有可用更新的时候触发
    autoUpdater.on('update-not-available', function (info) {
        let result = success()
        result.message = '当前为最新版本，无需更新'
        result.tag = 2
        window.webContents.send(channel.app.sendUpdateInfo, result)
    });

    //当发现一个可用更新的时候触发
    autoUpdater.on('update-available', function (info) {
        let result = success()
        result.result = info
        result.tag = 3
        window.webContents.send(channel.app.sendUpdateInfo, result)
    });

    // 更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {
        let result = success()
        result.message = '下载中'
        result.result = progressObj
        result.tag = 4
        window.webContents.send(channel.app.sendDownloadProgress, result)
    })

    //安装包下载完成
    autoUpdater.on('update-downloaded', function () {
        let result = success()
        result.message = '下载完成，是否退出更新？'
        result.tag = 5
        window.webContents.send(channel.app.sendUpdateDownloaded, result)
    });

    autoUpdater.on('error', function (error) {
        let result = failure()
        result.message = error
        result.tag = 6
        window.webContents.send(channel.app.sendUpdateInfo, result)
    });
}

