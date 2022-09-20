const {app, dialog, Menu, Tray} = require('electron')
const path = require('path')
const mainWindow = require('../main')

let tray = null

// 激活窗口
function activeMainWin() {
    let win = mainWindow.getWin()
    if (win) {
        if (win.isVisible()) {
            win.focus()
        }
    }
}

// 退出销毁对象
app.on('quit', () => {
    tray && tray.destroy()
    tray = null
})

// 新建非模态窗口


// 创建系统托盘
exports.creatTray = function () {
    // new Tray
    tray = new Tray(path.join('public/favicon.ico'))

    //右下角windows通知
   // tray.displayBalloon({title :'myapp',content:'d',largeIcon:false})

    const contextMenu = Menu.buildFromTemplate([
        {
            label: '关于',
            click(menuItem, win, event) {
                console.log('menuItem:', menuItem)
                console.log('win:', win) // win: null
                console.log('event:', event) // { shiftKey: true, ctrlKey: true, altKey: true, metaKey: false }

                dialog.showMessageBox({
                    message: 'east-pass by wangcb'
                })
            }
        },
        {type: 'separator'}, // 分割线
        {
            label: '退出',
            click(menuItem, win, event) {
                app.quit()
            }
        }
    ])

    tray.setToolTip('This is my test project')

    tray.on('click', (event, bounds, pos) => { // 左键点击
        try {
            // 激活窗口
            activeMainWin()
        } catch (err) {
            console.error(err)
        }
    })
        .on('right-click', (event) => { // 右键点击
            // 弹出菜单
            tray.popUpContextMenu(contextMenu)
        })
}
