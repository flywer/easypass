import {Controller, IpcHandle, Window} from 'einf'
import {app, BrowserWindow, dialog, shell} from 'electron'
import {AppService} from '../service/app.service'
import path, {join} from "path";
import {channel} from "@render/api/channel";
import {
    getAppDataPath,
    getAppPath,
    getAppTempDataPath,
    getAppTokenSettings,
    getCommonTextContent,
    getResourcePath
} from "@common/utils/utils";
import {calcSize, jsonfileWrite} from "@common/utils/fsUtils";
import {failure, success} from "@main/vo/resultVo";
import * as os from "os";
import log from "electron-log";
import {isEmpty, isEqual} from "lodash";
import {appTokenEncrypt} from "@common/utils/cryptoUtils";

@Controller()
export class AppController {
    constructor(
        private appService: AppService,
        @Window() private readonly mainWindow: BrowserWindow, // 主窗口实例
    ) {
    }

    /*应用令牌文件*/
    private readonly appTokenFile = {
        folderPath: path.join(getAppDataPath(), '/config'),
        fileName: 'token.json',
        getFullPath: () => {
            return path.join(this.appTokenFile.folderPath, this.appTokenFile.fileName)
        }
    }

    /*常用文本文件*/
    private readonly commonTextFile = {
        folderPath: path.join(getAppDataPath(), '/config'),
        fileName: 'commonText.json',
        getFullPath: () => {
            return path.join(this.commonTextFile.folderPath, this.commonTextFile.fileName)
        }
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
     * 获取应用资源文件路径
     * @constructor
     */
    @IpcHandle(channel.app.getResourcePath)
    public HandleGetResourcePath() {
        let result
        try {
            result = success()
            result.result = getResourcePath()
        } catch (e) {
            log.error(e)
            result = failure('系统异常')
        }
        return result
    }

    /**
     * 获取包含所有与应用相关的进程的内存和CPU的使用统计
     * @constructor
     */
    @IpcHandle(channel.app.getAppMetrics)
    public HandleGetAppMetrics() {
        let result
        try {
            result = success()
            result.result = app.getAppMetrics()
        } catch (e) {
            log.error(e)
            result = failure('系统异常')
        }
        return result
    }

    /**
     * 打开系统自身的emoji选取器
     * @constructor
     */
    @IpcHandle(channel.app.showEmojiPanel)
    public HandleShowEmojiPanel() {
        let result
        try {
            result = success()
            if (app.isEmojiPanelSupported())
                app.showEmojiPanel()
        } catch (e) {
            log.error(e)
            result = failure('系统异常')
        }
        return result
    }

    /**
     * 根据路径打开文件
     * @param path
     * @constructor
     */
    @IpcHandle(channel.app.openPath)
    public async HandleOpenPath(path: string) {
        let result
        try {
            result = success()
            if (!isEmpty(path))
                await shell.openPath(path)
        } catch (e) {
            log.error(e)
            result = failure('系统异常')
        }
        return result
    }

    /**
     * 打开应用文件夹
     * @constructor
     */
    @IpcHandle(channel.app.openAppFolder)
    public async HandleOpenAppFolder() {
        let result
        try {
            result = success()
            await shell.openPath(getAppPath())
        } catch (e) {
            log.error(e)
            result = failure('系统异常')
        }
        return result
    }

    /**
     * 获取应用文件夹大小
     * @constructor
     */
    @IpcHandle(channel.app.getAppFolderSize)
    public async HandleGetAppFolderSize() {
        let result
        try {
            result = success()
            await calcSize(getAppPath(), (err, size) => {
                if (err) log.error(err)
                result.result = size
            })
        } catch (e) {
            log.error(e)
            result = failure('系统异常')
        }
        return result
    }

    /**
     * 打开应用AppData文件夹
     * @constructor
     */
    @IpcHandle(channel.app.openAppDataFolder)
    public async HandleOpenAppDataFolder() {
        let result
        try {
            result = success()
            await shell.openPath(getAppDataPath())
        } catch (e) {
            log.error(e)
            result = failure('系统异常')
        }
        return result
    }

    /**
     * 获取应用AppData文件夹大小
     * @constructor
     */
    @IpcHandle(channel.app.getAppDataFolderSize)
    public async HandleGetAppDataFolderSize() {
        let result
        try {
            result = success()
            await calcSize(getAppDataPath(), (err, size) => {
                if (err) log.error(err)
                result.result = size
            })
        } catch (e) {
            log.error(e)
            result = failure('系统异常')
        }
        return result
    }

    /**
     * 打开应用Temp文件夹
     * @constructor
     */
    @IpcHandle(channel.app.openAppTempDataFolder)
    public async HandleOpenAppTempDataFolder() {
        let result
        try {
            result = success()
            await shell.openPath(getAppTempDataPath())
        } catch (e) {
            log.error(e)
            result = failure('系统异常')
        }
        return result
    }

    /**
     * 获取应用Temp文件夹大小
     * @constructor
     */
    @IpcHandle(channel.app.getAppTempDataFolderSize)
    public async HandleGetAppTempDataFolderSize() {
        let result
        try {
            result = success()
            await calcSize(getAppTempDataPath(), (err, size) => {
                if (err) log.error(err)
                result.result = size
            })
        } catch (e) {
            log.error(e)
            result = failure('系统异常')
        }
        return result
    }

    /**
     * 弹出打开文件框
     * @param options
     * @constructor
     */
    @IpcHandle(channel.app.showOpenDialog)
    public async HandleShowOpenDialog(options) {
        let result
        try {
            result = success()
            await dialog.showOpenDialog({
                title: options.title,
                filters: options.filters
            }).then(res => {
                if (!res.canceled) {
                    result.result = res.filePaths
                    result.tag = 1
                }
            })
        } catch (e) {
            log.error(e)
            result = failure('系统异常')
        }
        return result
    }

    /**
     * 弹出保存文件框
     * @param options
     * @constructor
     */
    @IpcHandle(channel.app.showSaveDialog)
    public async HandleShowSaveDialog(options) {
        let result
        try {
            result = success()
            await dialog.showSaveDialog({
                title: options.title,
                defaultPath: options.defaultPath,
                filters: options.filters
            }).then(res => {
                if (!res.canceled) {
                    result.result = res.filePath
                    result.tag = 1
                }
            })
        } catch (e) {
            log.error(e)
            result = failure('系统异常')
        }
        return result
    }

    //region 应用令牌
    /**
     * 获取应用令牌信息
     * @constructor
     */
    @IpcHandle(channel.app.getTokenSettings)
    public async HandleGetTokenSettings() {
        let result
        try {
            result = success()
            result.result = await getAppTokenSettings()
        } catch (e) {
            log.error(e)
            result = failure()
        }
        return result
    }

    /**
     * 设置应用令牌
     * @param token
     * @constructor
     */
    @IpcHandle(channel.app.setAppToken)
    public async HandleSetAppToken(token) {
        let result
        try {
            let tokenSettings = await getAppTokenSettings()
            if (token != null) {
                tokenSettings.haveToken = true
                tokenSettings.showTokenPanel = true
                tokenSettings.remainTimes = 5
                tokenSettings.appMinSizeLock = false
                tokenSettings.token = appTokenEncrypt(token)  //令牌加密
                jsonfileWrite(this.appTokenFile.getFullPath(), tokenSettings, {spaces: 2})
                result = success('设置令牌成功!')
            } else {
                tokenSettings.haveToken = false
                tokenSettings.showTokenPanel = false
                tokenSettings.token = null
                jsonfileWrite(this.appTokenFile.getFullPath(), tokenSettings, {spaces: 2})
                result = success('解除令牌成功!')
            }
        } catch (e) {
            log.error(e)
            result = failure()
        }
        return result
    }

    /**
     * 校验应用令牌
     * @param token
     * @constructor
     */
    @IpcHandle(channel.app.checkAppToken)
    public async HandleCheckAppToken(token) {
        let result
        try {
            let tokenSettings = await getAppTokenSettings()
            if (isEqual(appTokenEncrypt(token), tokenSettings.token)) {
                tokenSettings.remainTimes = 5
                jsonfileWrite(this.appTokenFile.getFullPath(), tokenSettings, {spaces: 2})
                result = success()
            } else {
                let tokenSettings = await getAppTokenSettings()
                if (tokenSettings.remainTimes == 0) {
                    tokenSettings.remainTimes = 0
                } else {
                    tokenSettings.remainTimes = tokenSettings.remainTimes - 1
                }
                jsonfileWrite(this.appTokenFile.getFullPath(), tokenSettings, {spaces: 2})
                result = failure('令牌错误')
            }
        } catch (e) {
            log.error(e)
            result = failure('系统异常')
        }
        return result
    }

    /**
     * 设置最小化时锁住应用
     * @param setup
     * @constructor
     */
    @IpcHandle(channel.app.setAppMinSizeLock)
    public async HandleSetAppMinSizeLock(setup: boolean) {
        let result
        try {
            let tokenSettings = await getAppTokenSettings()
            tokenSettings.appMinSizeLock = setup
            jsonfileWrite(this.appTokenFile.getFullPath(), tokenSettings, {spaces: 2})
            result = success()
        } catch (e) {
            log.error(e)
            result = failure()
        }
        return result
    }

    /**
     * 锁应用
     * @constructor
     */
    @IpcHandle(channel.app.lockApp)
    public async HandleLockApp() {
        const appTokenSettings = await getAppTokenSettings()
        //是否拥有应用令牌
        if (appTokenSettings.haveToken) {
            this.mainWindow.webContents.send(channel.app.showTokenPanel)
        }
    }

    //endregion

    //region 常用文本设置
    /**
     * 设置常用账号
     * @param account
     * @constructor
     */
    @IpcHandle(channel.app.setCommonAccount)
    public async HandleSetCommonAccount(account) {
        let result
        try {
            let res = (await getCommonTextContent())
            res.commonAccount = account
            jsonfileWrite(this.commonTextFile.getFullPath(), res, {spaces: 2})
            result = success('常用账号设置成功')
        } catch (e) {
            log.error(e)
            result = failure('常用账号设置失败')
        }
        return result
    }

    /**
     * 设置常用密码
     * @param password
     * @constructor
     */
    @IpcHandle(channel.app.setCommonPassword)
    public async HandleSetCommonPassword(password) {
        let result
        try {
            let res = (await getCommonTextContent())
            res.commonPassword = password
            jsonfileWrite(this.commonTextFile.getFullPath(), res, {spaces: 2})
            result = success('常用密码设置成功')
        } catch (e) {
            log.error(e)
            result = failure('常用密码设置失败')
        }
        return result
    }

    /**
     * 获取常用文本
     * @constructor
     */
    @IpcHandle(channel.app.getCommonTextContent)
    public async HandleGetCommonTextContent() {
        let result
        try {
            result = success()
            result.result = (await getCommonTextContent())
        } catch (e) {
            log.error(e)
            result = failure('获取常用文本失败')
        }
        return result
    }

    //endregion
}
