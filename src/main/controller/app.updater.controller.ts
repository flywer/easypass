import {Controller, IpcHandle} from "einf";
import {channel} from "@render/api/channel";
import {failure, success} from "@main/vo/resultVo";
import {autoUpdater} from "electron-updater";
import log from "electron-log";
import {setHasUpdate} from "@main/app/autoUpdater";

/**
 * 应用更新Controller
 */
@Controller()
export class AppUpdaterController {
    constructor() {
    }

    /**
     * 获取应用版本信息
     */
    @IpcHandle(channel.app.updater.getAppVersion)
    public HandleGetAppVersion() {
        let result
        try {
            result = success()
            result.result = autoUpdater.currentVersion.version
        } catch (e) {
            log.error(e)
            result = failure()
            result.result = e
        }
        return result
    }

    /**
     * 检查应用是否需要更新
     * @constructor
     */
    @IpcHandle(channel.app.updater.checkForUpdate)
    public async HandleCheckForUpdate() {
        let result
        try {
            result = success()
            await autoUpdater.checkForUpdates()
        } catch (e) {
            log.error(e)
            result = failure()
            result.result = e
        }
        return result
    }

    /**
     * 启用下载更新
     * @constructor
     */
    @IpcHandle(channel.app.updater.downloadUpdate)
    public async HandleDownloadUpdate() {
        let result
        try {
            result = success()
            await autoUpdater.downloadUpdate()
            result.message = '下载开始'
        } catch (e) {
            log.error(e)
            result = failure()
            result.message = '下载失败'
            result.result = e
        }
        return result
    }

    /**
     * 退出并安装应用
     * @constructor
     */
    @IpcHandle(channel.app.updater.quitAndInstall)
    public async HandleQuitAndInstall() {
        let result
        try {
            result = success()
            await setHasUpdate(false)
            //退出并安装
            autoUpdater.quitAndInstall();
        } catch (e) {
            log.error(e)
            result = failure()
            result.result = e
        }
        return result
    }
}