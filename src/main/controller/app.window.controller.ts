import {Controller, IpcHandle, Window} from "einf";
import {AppService} from "@main/service/app.service";
import {BrowserWindow} from "electron";
import {channel} from "@render/api/channel";
import {getAppSettings} from "@common/utils/utils";

/**
 * 应用窗口Controller
 */
@Controller()
export class AppWindowController {
    constructor(
        private appService: AppService,
        @Window() private readonly mainWindow: BrowserWindow, // 主窗口实例
    ) {
    }

    /**
     * 设置主窗体 最大化、最小化、关闭
     * @param setup
     * @constructor
     */
    @IpcHandle(channel.app.window.setWindow)
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
}