import {app, Tray, Menu, nativeImage, nativeTheme, BrowserWindow} from 'electron'
import {createEinf, IpcSend} from 'einf'
import {AppController} from './controller/app.controller'
import {createWindow} from './main.window'
import {sequelize} from "@main/sequelize.init";
import {GroupController} from "@main/controller/group.controller";
import {tray, trayInit} from "@main/app/app.tray";
import {GroupItemController} from "@main/controller/groupItem.controller";
import installExtension from 'electron-devtools-installer'
import {UserController} from "@main/controller/user.controller";
import {getAppSettings, getNetworkInfo, getUserAppDataFolder} from "@common/utils/utils";
import log from 'electron-log'
import * as Path from "path";

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
//设置日志存储位置
log.transports.file.resolvePath = () => Path.join(getUserAppDataFolder(), 'logs/main.log')

async function electronAppInit() {
    const isDev = !app.isPackaged

    //禁用硬件加速技术
    app.disableHardwareAcceleration()
    //应用单例运行，不可存在多个同时运行
    if (!app.requestSingleInstanceLock()) app.quit();


    app.setAppUserModelId('EasyPass')

    //当应用程序关闭所有窗口时触发
    app.on('window-all-closed', () => {
        //Mac操作系统下的用户体验准则:
        // 应用程序关闭所有窗口后，应用不退出，而是继续保留在Dock栏
        if (process.platform !== 'darwin')
            app.exit()
    })

    if (isDev) {
        if (process.platform === 'win32') {
            process.on('message', (data) => {
                if (data === 'graceful-exit')
                    app.exit()
            })
        } else {
            process.on('SIGTERM', () => {
                app.exit()
            })
        }
    }

    ///应用启动后的操作
    app.whenReady().then(async () => {

        const appSettings = await getAppSettings()
        if (appSettings.enableTray)
            trayInit()
        if (isDev) {
            //安装vue开发者工具
            await installVueDevtools()
        }
    })


}

/**
 * 启动主进程时在这里进行初始化操作
 */
async function bootstrap() {
    try {
        await electronAppInit()

        await createEinf({
            window: createWindow,
            controllers: [AppController, GroupController, GroupItemController, UserController],
            injects: [{
                name: 'IS_DEV',
                inject: !app.isPackaged,
            }],
        })

        //验证是否连接成功
        sequelize.authenticate().then(async () => {
            log.info('===================Database connection succeeded :) ================');
            //await databaseInit()

            /* await GroupItem.sync({force:true})
             //密码组与组项是一对多的关系
             Group.hasMany(GroupItem)
             GroupItem.belongsTo(Group)
             await GroupItem.sync({alter: true})//添加外键*/

        }).catch(err => {
            log.error('=================Database connection failed :( ===================', err);
        });

    } catch (error) {
        log.error(error)
        app.quit()
    }
}

bootstrap()

/**
 * 安装vue开发者工具
 */
async function installVueDevtools() {
    try {
        //不能用beta版
        const vue_devtools = {id: "nhdogjmejiglipccpnnnanhbledajbpd", electron: ">=1.2.1"}
        const result = await installExtension(vue_devtools)
        if (result) {
            log.log("success load : " + result)
        }
    } catch (e) {
        log.error('Vue Devtools failed to install:', e.toString())
    }
}
