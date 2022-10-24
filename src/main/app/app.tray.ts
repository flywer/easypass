import {BrowserWindow, Menu, nativeImage, Tray, MenuItem, dialog} from "electron";
import {join} from "path";

// 注意:contextMenu, Tooltip 和 Title 代码需要写在这里!

export let tray

const assertsPath = 'src/render/assets/img/appTray/'

/**
 * 启用系统托盘
 */
export function trayInit() {
    const icon = nativeImage.createFromPath('src/render/public/favicon.ico')
    tray = new Tray(icon)

    let quitMenuItem = new MenuItem({
        icon: nativeImage.createFromPath(join(assertsPath, 'quit.png')),
        label: '退出',
        role: "quit"
    })
    let privacyPolicyMenuItem = new MenuItem({
        label: '隐私协议',
        click: () => {
            dialog.showMessageBox({
                type: 'info',
                title: '隐私协议',
                message: '\n    本软件尊重并保护所有使用服务用户的个人隐私权。为了给您提供更准确、更优质的服务，本软件会按照本隐私权政策的规定使用和收集您的一些行为信息。您在同意本软件服务使用协议之时，即视为您已经同意本隐私权政策全部内容。本隐私权政策属于本软件服务使用协议不可分割的一部分，如果不同意将无法使用。本协议会定期更新。\n' +
                    '\n1.适用范围\n' +
                    '\na)在您使用本软件时，本软件会记录的您对本软件的一些操作行为信息，包括但不限于您使用本软件进行文件上传的耗时、类型、数量等信息。\n' +
                    '\n2.信息的使用\n' +
                    '\na)在获得您的使用数据之后，本软件会将其上传至数据分析服务器，以便分析数据后，提供给您更好的服务。\n' +
                    '\n3.信息披露\n' +
                    '\na)本软件不会将您的信息披露给不受信任的第三方。\n' +
                    '\nb)根据法律的有关规定，或者行政或司法机构的要求，向第三方或者行政、司法机构披露;\n' +
                    '\nc)如您出现违反中国有关法律、法规或者相关规则的情况，需要向第三方披露;\n' +
                    '\n4.信息安全\n' +
                    '\na)本软件不会收集您的个人信息、密钥信息等隐私信息，所收集的信息仅仅作为改善软件、优化体验、了解软件日活等用途。\n',
                buttons: ['ok']
            })
        }
    })

    const contextMenu = Menu.buildFromTemplate([
        privacyPolicyMenuItem,
        quitMenuItem
    ])
    tray.setContextMenu(contextMenu)

    tray.setToolTip('管理密码小工具')

    tray.on('click', async () => {
        // 点击tray图标时触发，一般习惯点击后显示应用
        BrowserWindow.getAllWindows().at(0).show()
    })

}
