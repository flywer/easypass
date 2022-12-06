import {Controller, IpcHandle} from "einf";
import {app} from "electron";
import {channel} from "@render/api/channel";
import {getAppProxySettings, getAppSettings} from "@common/utils/utils";
import {tray, trayInit} from "@main/app/app.tray";
import {jsonfileWrite, readFsSync} from "@common/utils/fsUtils";
import {failure, success} from "@main/vo/resultVo";
import config from "@common/config/appConfig.json";
import {isEmpty} from "lodash";
import log from "electron-log";
import {appProxyFile, appSettingsFile, appThemeFile} from "@common/utils/appFilePath";

/**
 * 应用设置Controller
 */
@Controller()
export class AppSettingsController {
    constructor() {
    }

    /**
     * 写入应用设置
     * @param setup
     * @constructor
     */
    @IpcHandle(channel.app.settings.setAppSettings)
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

        jsonfileWrite(appSettingsFile.getFullPath(), appSettings, {spaces: 2})
    }

    /**
     * 获取应用设置
     * @constructor
     */
    @IpcHandle(channel.app.settings.getAppSettings)
    public async HandleGetAppSettings() {
        let result = success()
        result.result = await getAppSettings()
        return result
    }

    /**
     * 获取应用主题
     */
    @IpcHandle(channel.app.settings.getAppTheme)
    public async HandleGetAppTheme() {
        let result
        try {
            let defaultTheme = config.defaultTheme
            result = success()
            //判断主题文件是否存在，不存在则创建，并返回实际数据
            let buffer = await readFsSync(appThemeFile.getFullPath())
            if (buffer == null || isEmpty(buffer.toString())) {
                jsonfileWrite(appThemeFile.getFullPath(), defaultTheme, {spaces: 2})
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
    @IpcHandle(channel.app.settings.setAppTheme)
    public async HandleSetAppTheme(data) {
        let result
        try {
            jsonfileWrite(appThemeFile.getFullPath(), data, {spaces: 2})
            result = success()
        } catch (e) {
            log.error(e)
            result = failure()
            result.result = e
        }
        return result
    }

    /**
     * 设置网络代理
     * @param setup
     * @constructor
     */
    @IpcHandle(channel.app.settings.setProxySettings)
    public async HandleSetProxy(setup) {
        let result
        try {
            jsonfileWrite(appProxyFile.getFullPath(), setup, {spaces: 2})
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
    @IpcHandle(channel.app.settings.getAppProxySettings)
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