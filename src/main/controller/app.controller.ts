import {Controller, IpcHandle, Window} from 'einf'
import {app, BrowserWindow} from 'electron'
import {AppService} from '../service/app.service'
import path, {join} from "path";
import {channel} from "@render/api/channel";
import {getAppProxySettings, getAppSettings, getResourcePath, getUserAppDataFolder} from "@common/utils/utils";
import {readFsSync, writeFs} from "@common/utils/fsUtils";
import {failure, success} from "@main/vo/resultVo";
import config from "@common/config/appConfig.json"
import {autoUpdater} from "electron-updater";
import * as os from "os";
import log from "electron-log";
import {isEmpty} from "lodash";
import {tray, trayInit} from "@main/app/app.tray";
import {isEqual} from "lodash";
import {setHasUpdate} from "@main/app/autoUpdater";

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
        getFullPath: () => {
            return path.join(this.appSettingsFile.folderPath, this.appSettingsFile.fileName)
        }
    }

    /*应用主题文件*/
    private readonly appThemeFile = {
        folderPath: path.join(getUserAppDataFolder(), '/config'),
        fileName: 'theme.json',
        getFullPath: () => {
            return path.join(this.appThemeFile.folderPath, this.appThemeFile.fileName)
        }
    }

    /*网络代理配置文件*/
    private readonly appProxyFile = {
        folderPath: path.join(getUserAppDataFolder(), '/config'),
        fileName: 'proxy.json',
        getFullPath: () => {
            return path.join(this.appThemeFile.folderPath, this.appThemeFile.fileName)
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
     * 写入应用设置
     * @param setup
     * @constructor
     */
    @IpcHandle(channel.app.setAppSettings)
    public async HandleSetAppSettings(setup) {
        //获取本地设置文件
        const appSettings = await getAppSettings()

        /*设置开机自启*/
        //mac系统
        if (process.platform === "darwin") {
            app.setLoginItemSettings({
                openAtLogin: setup.openAtLogin,
                openAsHidden: setup.openAsHidden
            });
        } else {
            app.setLoginItemSettings({
                openAtLogin: setup.openAtLogin
            });
        }
        appSettings.openAtLogin = setup.openAtLogin
        appSettings.openAsHidden = setup.openAsHidden

        /*设置关闭时隐藏到托盘*/
        appSettings.closeAsHidden = setup.closeAsHidden

        /*设置是否启用托盘*/
        if (setup.enableTray)
            trayInit()
        else
            tray.destroy()
        appSettings.enableTray = setup.enableTray

        /*是否自动检查更新*/
        appSettings.autoCheckUpdates = setup.autoCheckUpdates

        writeFs(this.appSettingsFile, JSON.stringify(appSettings))
    }

    /**
     * 设置登录模式
     * @param setup
     * @constructor
     */
    @IpcHandle(channel.app.setLoginMode)
    public async HandleSetLoginMode(setup) {
        //获取本地设置文件
        const appSettings = await getAppSettings()
        /*登录模式*/
        appSettings.loginMode = setup
        writeFs(this.appSettingsFile, JSON.stringify(appSettings))
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
            let buffer = await readFsSync(this.appThemeFile.getFullPath())
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

    //region autoUpdater

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

    //endregion

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

    /**
     * 应用重启
     * @constructor
     */
    @IpcHandle(channel.app.relaunch)
    public HandleRelaunch() {
        app.relaunch()
        app.exit(0)
    }

    /**
     * 设置网络代理
     * @param setup
     * @constructor
     */
    @IpcHandle(channel.app.setProxy)
    public async HandleSetProxy(setup) {
        let result
        try {
            writeFs(this.appProxyFile, JSON.stringify(setup))
            result = success()
        } catch (e) {
            log.error(e)
            result = failure()
        }
        return result
    }

    /**
     * 获取网络代理配置
     * @constructor
     */
    @IpcHandle(channel.app.getAppProxySettings)
    public async HandleGetAppProxySettings() {
        let result
        try {
            result = success()
            result.result = await getAppProxySettings()
        } catch (e) {
            log.error(e)
            result = failure()
        }
        return result
    }

}
