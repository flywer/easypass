import {join} from 'path'
import {BrowserWindow, app} from 'electron'
import {handleUpdate} from "@main/app/autoUpdater";
import {channel} from "@render/api/channel";
import {getNetworkInfo} from "@main/utils";

const isDev = !app.isPackaged

export async function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 568,
        resizable: false,
        frame: false, // 无边框
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'), // 放到下面就报错
            nodeIntegration: false,
            contextIsolation: true,
            devTools: isDev,
            webSecurity: false, // 取消跨域限制
        },
        autoHideMenuBar: !isDev,
    })

    const URL = isDev
        ? process.env.DS_RENDERER_URL
        : `file://${join(app.getAppPath(), 'dist/render/index.html')}`

     win.loadURL(URL).then(() => {
         if (isDev) {
             win.webContents.openDevTools()
         } else
             win.removeMenu()
         //自动更新组件
         handleUpdate(win)
    })

    //窗口关闭时触发
    win.on('closed', () => {
        win.destroy()
    })

    return win
}

export async function restoreOrCreateWindow() {
    let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed())

    if (window === undefined)
        window = await createWindow()

    if (window.isMinimized())
        window.restore()

    //window.focus()
}
