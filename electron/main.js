// 控制应用生命周期和创建原生浏览器窗口的模组
const {app, BrowserWindow, ipcMain, ipcRenderer} = require('electron')
const path = require('path')
const tray = require('./tray')

//对 mainWindow 的全局引用 (有必要防止窗口被垃圾回收)
let mainWindow = null

//创建主窗口
function createWindow() {
    // 创建浏览器窗口
    mainWindow = new BrowserWindow({
        width: 800,
        height: 500,
        frame: false,//无边框
        //resizable:false,//不可调整窗口大小
        webPreferences: {
            preload: path.join(__dirname, './preload.js'),
            nodeIntegration: true,
            enableRemoteModule: true,
            webSecurity:false, //取消跨域限制
            //contextIsolation:false //取消上下文隔离，将会暴露主进程，且不再使用preload
        }
    })

    // 加载 index.html
    //mainWindow.loadFile('index.html')
    mainWindow.loadURL("http://localhost:5173")

    // 打开开发工具
    mainWindow.webContents.openDevTools()
}


app.whenReady().then(() => {
    createWindow()
    tray.creatTray()

    ipcMain.on('set-window', handleSetWindow)//监听设置应用窗口大小
})

/**
 * 设置应用窗口大小
 * @param event
 * @param title
 */
function handleSetWindow(event, title) {
    if (title === 'window-min')
        mainWindow.minimize()
    else if (title === 'window-max') {
        if (mainWindow.isMaximized()) {
            mainWindow.restore();
        } else {
            mainWindow.maximize();
        }
    } else if (title === 'window-close')
        mainWindow.close()
}

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

//只可在electron中使用
exports.getWin = function () {
    return mainWindow
}
