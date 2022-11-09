import {join} from 'path'
import {BrowserWindow, app, nativeImage} from 'electron'
import {handleAutoUpdater, handleUpdate} from "@main/app/autoUpdater";
import {getAppSettings, getAppTokenSettings, getResourcePath} from "@common/utils/utils";
import {tray} from "@main/app/app.tray";
import {autoUpdater} from "electron-updater";
import {channel} from "@render/api/channel";
import log from "electron-log";

const isDev = !app.isPackaged
let isAutoCheckUpdate = false
export let mainWindow

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
        show: false,
        icon: nativeImage.createFromPath(join(getResourcePath(), '/assets/logo.png')),
        backgroundColor: '#ffffff'
    })
    const appSettings = await getAppSettings()

    //准备完毕，将要显示
    win.on("ready-to-show", () => {
        //判断此时是否为开机自启，且是否需要隐藏
        if (appSettings.openAsHidden)
            win.hide()
        else
            win.show()
    });

    //渲染进程URL
    const URL = isDev
        ? process.env.DS_RENDERER_URL
        : `file://${join(app.getAppPath(), 'dist/render/index.html')}`
    //主窗口加载页面
    win.loadURL(URL).then(async () => {
        const appTokenSettings = await getAppTokenSettings()
        if(appTokenSettings.haveToken){
            win.webContents.send(channel.app.showTokenPanel)
        }

        if (isDev) {
            win.webContents.openDevTools()
        } else {
            win.removeMenu()

            //应用自动检查更新
            if (appSettings.autoCheckUpdates) {
                handleAutoUpdater(win)
                await autoUpdater.checkForUpdates()
            } else {
                //自主更新
                handleUpdate(win)
            }
        }
    })

    //窗口关闭时触发
    win.on('closed', () => {
        if (tray != null && !tray.isDestroyed())
            tray.destroy()
        win.destroy()
    })

    win.on('hide',async () => {
        const appTokenSettings = await getAppTokenSettings()
        //是否拥有应用令牌
        if (appTokenSettings.haveToken) {
            win.webContents.send(channel.app.showTokenPanel)
        }
    })

    win.on('minimize',async () => {
        const appTokenSettings = await getAppTokenSettings()
        //是否拥有应用令牌
        if (appTokenSettings.haveToken && appTokenSettings.appMinSizeLock) {
            win.webContents.send(channel.app.showTokenPanel)
        }
    })

    mainWindow = win
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
