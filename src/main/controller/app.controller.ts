import {Controller, IpcHandle, IpcSend, Window} from 'einf'
import {app, BrowserWindow} from 'electron'
import {AppService} from '../service/app.service'
import path from "path";
import {channel} from "@render/api/channel";

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
}
