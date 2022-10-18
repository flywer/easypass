import {Menu, nativeImage, Tray} from "electron";

// 注意: 你的 contextMenu, Tooltip 和 Title 代码需要写在这里!

export let tray

/**
 * 启用系统托盘
 */
export function trayInit() {
    const icon = nativeImage.createFromPath('src/render/public/favicon.ico')
    tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
        {label: 'Item1', type: 'radio'},
        {label: 'Item2', type: 'radio'},
        {label: 'Item3', type: 'radio', checked: true},
        {label: 'Item4', type: 'radio'}
    ])

    tray.setContextMenu(contextMenu)
}
