import {Controller, IpcHandle, Window} from 'einf'
import {app, BrowserWindow} from 'electron'
import {AppService} from '../service/app.service'
import path, {join} from "path";
import {channel} from "@render/api/channel";
import {getAppSettings, getResourcePath, getUserAppDataFolder} from "@common/utils/utils";
import {readFsSync, writeFs} from "@common/utils/fsUtils";
import {failure, success} from "@main/vo/resultVo";
import config from "@common/config/appConfig.json"
import {autoUpdater} from "electron-updater";
import * as os from "os";
import log from "electron-log";
import {isEmpty} from "lodash";
import {tray, trayInit} from "@main/app/app.tray";


@Controller()
export class AppController {
    constructor(
        private appService: AppService,
        @Window() private readonly mainWindow: BrowserWindow, // 主窗口实例
    ) {
    }

    /*应用设置文件*/
    private readonly appSettingsFile = {
        folderPath: path.join(getUserAppDataFolder(), '/config'),
        fileName: 'settings.json',
        fullPath: '',
        constructor() {
            this.fullPath = path.join(this.folderPath, this.fileName)
        }
    }

    /*应用主题文件*/
    private readonly appThemeFile = {
        folderPath: path.join(getUserAppDataFolder(), '/config'),
        fileName: 'theme.json',
        fullPath: '',
        constructor() {
            this.fullPath = path.join(this.folderPath, this.fileName)
        }
    }

    /**
     * 设置主窗体 最大化、最小化、关闭
     * @param setup
     * @constructor
     */
    @IpcHandle(channel.app.setWindow)
    public async HandleSetWindow(setup: string) {
        if (setup === 'window-min') {
            this.mainWindow.minimize()
        } else if (setup === 'window-max') {
            if (this.mainWindow.isMaximized())
                this.mainWindow.restore()
            else
                this.mainWindow.maximize()
        } else if (setup === 'window-close') {
            const appSettings = await getAppSettings()
            if (appSettings.closeAsHidden) {
                this.mainWindow.hide()
            } else this.mainWindow.close()
        }
    }

    /**
     * 设置开机自启
     * @param setup
     */
    @IpcHandle(channel.app.setOpenAtLogin)
    public async HandleSetOpenAtLogin(setup) {
        //mac系统
        if (process.platform === "darwin") {
            app.setLoginItemSettings({
                openAtLogin: setup.openAtLogin,
                openAsHidden: setup.openAsHidden
            });
        } else {
            app.setLoginItemSettings({
                openAtLogin: true
            });
        }

        //获取本地设置文件
        const appSettings = await getAppSettings()
        appSettings.openAtLogin = setup.openAtLogin
        appSettings.openAsHidden = setup.openAsHidden
        writeFs(this.appSettingsFile, JSON.stringify(appSettings))
    }

    /**
     * 设置关闭时隐藏到托盘
     * @param setup
     */
    @IpcHandle(channel.app.setCloseAsHidden)
    public async HandleSetCloseAsHidden(setup) {
        //获取本地设置文件
        const appSettings = await getAppSettings()
        appSettings.closeAsHidden = setup
        writeFs(this.appSettingsFile, JSON.stringify(appSettings))
    }

    /**
     * 设置是否启用托盘
     * @param setup
     * @constructor
     */
    @IpcHandle(channel.app.setEnableTray)
    public async HandleSetEnableTray(setup) {
        //获取本地设置文件
        const appSettings = await getAppSettings()
        appSettings.enableTray = setup
        writeFs(this.appSettingsFile, JSON.stringify(appSettings))
        if (setup) {
            trayInit()
        } else {
            if (!tray.isDestroyed()) {
                tray.destroy()
            }
        }
    }

    /**
     * 获取应用设置
     * @constructor
     */
    @IpcHandle(channel.app.getAppSettings)
    public async HandleGetAppSettings() {
        let result = success()
        result.result = await getAppSettings()
        return result
    }

    /**
     * 获取应用主题
     */
    @IpcHandle(channel.app.getAppTheme)
    public async HandleGetAppTheme() {
        let result
        try {
            let defaultTheme = config.defaultTheme
            result = success()
            //判断主题文件是否存在，不存在则创建，并返回实际数据
            let buffer = await readFsSync(this.appThemeFile.fullPath)
            if (buffer == null || isEmpty(buffer.toString())) {
                writeFs(this.appThemeFile, JSON.stringify(defaultTheme))
                result.result = defaultTheme
            } else {
                result.result = JSON.parse(buffer.toString())
            }
        } catch (e) {
            log.error(e)
            result = failure()
            result.result = e
        }
        return result
    }

    /**
     * 设置应用主题
     * @param data
     */
    @IpcHandle(channel.app.setAppTheme)
    public async HandleSetAppTheme(data) {
        let result
        try {
            writeFs(this.appThemeFile, data)
            result = success()
        } catch (e) {
            log.error(e)
            result = failure()
            result.result = e
        }
        return result
    }

    /**
     * 获取应用版本信息
     */
    @IpcHandle(channel.app.getAppVersion)
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
    @IpcHandle(channel.app.checkForUpdate)
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
    @IpcHandle(channel.app.downloadUpdate)
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
    @IpcHandle(channel.app.quitAndInstall)
    public HandleQuitAndInstall() {
        let result
        try {
            result = success()
            //退出并安装
            autoUpdater.quitAndInstall();
        } catch (e) {
            log.error(e)
            result = failure()
            result.result = e
        }
        return result
    }

    /**
     * 获取网络接口、MAC地址等信息
     * @constructor
     */
    @IpcHandle(channel.app.getNetworkInterfaces)
    public HandleGetNetworkInterfaces() {
        let result
        try {
            result = success()
            result.result = {
                mac: null,
                hostname: null
            }
            if (os.networkInterfaces().WLAN) {
                result.result.mac = os.networkInterfaces().WLAN[0].mac
            } else {
                result.result.mac = os.networkInterfaces()['以太网'][0].mac
            }
            result.result.hostname = os.hostname()
        } catch (e) {
            result = failure()
            log.error(e)
        }
        return result
    }

    /**
     * 获取应用基本信息
     * @constructor
     */
    @IpcHandle(channel.app.getAppInfo)
    public HandleGetAppInfo() {
        let result
        result = success()
        result.result = {
            appPath: app.getAppPath(),
            URL: `file://${join(app.getAppPath(), 'dist/render/index.html')}`,
            isPackaged: app.isPackaged,
            resourcesPath: getResourcePath()
        }
        return result
    }

}
