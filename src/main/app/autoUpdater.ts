import {failure, success} from "@main/vo/resultVo";
import {channel} from "@render/api/channel";
import log from "electron-log";
import {autoUpdater} from "electron-updater";
import {nativeImage, Notification} from 'electron'
import path, {join} from "path";
import {getAppSettings, getResourcePath, getAppDataPath} from "@common/utils/utils";
import {writeFs} from "@common/utils/fsUtils";

/**
 * 用户自主更新时的设置
 */
export const handleUpdate = (window) => {
    //不启用自动更新，会在每次检测到可更新版本时自动更新
    autoUpdater.autoDownload = false

    //开始检测更新
    autoUpdater.on('checking-for-update', async function () {
        let result = success()
        result.message = '正在检测更新...'
        result.tag = 1
        window.webContents.send(channel.app.sendUpdateInfo, result)
    });

    //当没有可用更新的时候触发
    autoUpdater.on('update-not-available', async function (info) {
        await setHasUpdate(false)
        let result = success()
        result.message = '当前为最新版本，无需更新~'
        result.tag = 2
        window.webContents.send(channel.app.sendUpdateInfo, result)
    });

    //当发现一个可用更新的时候触发
    autoUpdater.on('update-available', async function (info) {
        await setHasUpdate(true)
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
        log.error(error)
        let result = failure()
        result.message = error.message
        result.tag = 6
        window.webContents.send(channel.app.sendUpdateInfo, result)
    });
}

/**
 * 自动更新时的设置
 */
export const handleAutoUpdater = (window) => {
    //不启用自动更新，会在每次检测到可更新版本时自动更新
    autoUpdater.autoDownload = false

    const logoPath = path.join(getResourcePath(), '/assets', 'logo.png')

    //当发现一个可用更新的时候触发
    autoUpdater.on('update-available', async function (info) {
        await setHasUpdate(true)

        let updateInfoNot = new Notification({
            title: `发现可用新版本 v${info.version}`,
            body: `点击下载`,
            icon: nativeImage.createFromPath(logoPath)
        })
        updateInfoNot.show()
        updateInfoNot.on('click', async () => {
            //切换到自主更新状态
            handleUpdate(window)
            await autoUpdater.downloadUpdate()
            updateInfoNot.close()
        })
    });

    //当没有可用更新的时候触发
    autoUpdater.on('update-not-available', async function (info) {
        await setHasUpdate(false)
        //切换到自主更新状态
        handleUpdate(window)
    });
}

/*记录可用更新情况*/
export const setHasUpdate = async (hasUpdate: boolean) => {
    //获取本地设置文件
    const appSettings = await getAppSettings()
    appSettings.hasUpdates = hasUpdate //记录已有可用更新，显示在前端
    writeFs({
        folderPath: join(getAppDataPath(), '/config'),
        fileName: 'settings.json'
    }, JSON.stringify(appSettings))
}

