import { Controller, IpcHandle, IpcSend } from 'einf'
import { BrowserWindow } from 'electron'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
  ) {
  }

  // 主窗口实例
  win: BrowserWindow = BrowserWindow.getAllWindows().find(w => !w.isDestroyed())

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
      this.win.minimize()
    }
    else if (title === 'window-max') {
      if (this.win.isMaximized())
        this.win.restore()
      else
        this.win.maximize()
    }
    else if (title === 'window-close') {
      this.win.close()
    }
  }
}
