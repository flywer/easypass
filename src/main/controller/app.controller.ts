import {Controller, IpcHandle, IpcSend, Window} from 'einf'
import {app, BrowserWindow} from 'electron'
import {AppService} from '../service/app.service'
import path, {join} from "path";
import {channel} from "@render/api/channel";
import fs from "fs";
import {fileExistAndWrite, getUserAppDataFolder, getUserHome, writeFs} from "@main/utils";
import {failure, success} from "@main/vo/resultVo";
import * as os from "os";

@Controller()
export class AppController {
    constructor(
        private appService: AppService,
        @Window() private readonly mainWindow: BrowserWindow // 主窗口实例
    ) {
    }

    /**
     * 设置主窗体 最大化、最小化、关闭
     * @param setup
     */
    @IpcHandle(channel.app.setWindow)
    public async handleSetWindow(setup: string) {
        if (setup === 'window-min') {
            this.mainWindow.minimize()
        } else if (setup === 'window-max') {
            if (this.mainWindow.isMaximized())
                this.mainWindow.restore()
            else
                this.mainWindow.maximize()
        } else if (setup === 'window-close') {
            this.mainWindow.close()
        }
    }

    /**
     * 设置开机自启
     * @param setup
     */
    @IpcHandle(channel.app.setOpenAtLogin)
    public async handleSetOpenAtLogin(setup: boolean) {
        const exeName = path.basename(process.execPath);
        //mac系统
        if (process.platform === "darwin") {
            app.setLoginItemSettings({
                openAtLogin: setup,
                openAsHidden: setup
            });
        } else {
            app.setLoginItemSettings({
                openAtLogin: setup,
                openAsHidden: setup,
                path: process.execPath,
                args: [
                    "--processStart", `"${exeName}"`,
                    "--process-start-args", `"--hidden"`
                ]
            });
        }
    }

    /**
     * 获取开机自启状态
     */
    @IpcHandle(channel.app.getOpenAtLogin)
    public handleGetOpenAtLogin() {
        const exeName = path.basename(process.execPath);

        let settings: Electron.LoginItemSettings

        if (process.platform === "darwin") {
            settings = app.getLoginItemSettings();
        } else {
            settings = app.getLoginItemSettings({
                path: process.execPath,
                args: [
                    "--processStart", `"${exeName}"`,
                    "--process-start-args", `"--hidden"`
                ]
            });
        }
        return settings.openAtLogin
    }

    /**
     * 获取应用主题
     */
    @IpcHandle(channel.app.getAppTheme)
    public async handleGetAppTheme() {
        let result
        try {
            let defaultTheme = {
                primaryColor: "#5f0c97",
                errorColor: "#ff4d4f",
                warningColor: "#faad14",
                successColor: "#52c41a",
                infoColor: "#1890ff"
            }
            result = success()
            //判断主题文件是否存在，不存在则创建，并返回实际数据
            const themeBuffer = await fileExistAndWrite(getUserAppDataFolder(), 'theme.json', JSON.stringify(defaultTheme))
            result.result = JSON.parse(themeBuffer.toString())
        } catch (e) {
            console.error(e)
            result = failure()
            result.result = e
        }
        return result
    }

    @IpcHandle(channel.app.setAppTheme)
    public async handleSetAppTheme(data) {
        let result
        try {
            writeFs(path.join(getUserAppDataFolder(), 'theme.json'), data)
            result = success()
        } catch (e) {
            console.error(e)
            result = failure()
            result.result = e
        }
        return result
    }
}
