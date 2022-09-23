import {Controller, IpcHandle, IpcSend, Window} from 'einf'
import {BrowserWindow} from 'electron'
import {AppService} from '../service/app.service'

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
}
