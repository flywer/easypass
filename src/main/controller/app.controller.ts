import {Controller, IpcHandle, IpcSend, Window} from 'einf'
import {app, BrowserWindow} from 'electron'
import {AppService} from '../service/app.service'
import path from "path";

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
    @IpcHandle('set-window')
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
    @IpcHandle('set-openAtLogin')
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

    @IpcHandle('get-openAtLogin')
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
