import {Controller, IpcHandle, IpcSend,Window} from 'einf'
import {BrowserWindow} from 'electron'
import {AppService} from '../service/app.service'

@Controller()
export class AppController {
    constructor(
        private appService: AppService,
        @Window() private readonly mainWindow: BrowserWindow // 主窗口实例
    ) {
    }

    @IpcSend('reply-msg')
    public async replyMsg(msg: string) {
        return `${this.appService.getDelayTime()} seconds later, the main process replies to your message: ${msg}`
    }

    @IpcHandle('send-msg')
    public async handleSendMsg(msg: string): Promise<string> {
        setTimeout(() => {
            this.replyMsg(msg)
        }, this.appService.getDelayTime() * 1000)

        return `The main process received your message: ${msg}`
    }


    @IpcHandle('set-window')
    public async handleSetWindow(title: string) {
        if (title === 'window-min') {
            this.mainWindow.minimize()
        } else if (title === 'window-max') {
            if (this.mainWindow.isMaximized())
                this.mainWindow.restore()
            else
                this.mainWindow.maximize()
        } else if (title === 'window-close') {
            this.mainWindow.close()
        }
    }
}
