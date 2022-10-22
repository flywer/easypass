import {app, Tray, Menu, nativeImage, nativeTheme, BrowserWindow} from 'electron'
import {createEinf, IpcSend} from 'einf'
import {AppController} from './controller/app.controller'
import {createWindow} from './main.window'
import {sequelize} from "@main/sequelize.init";
import {PwdGroupController} from "@main/controller/pwdGroup.controller";
import path from "path";
import {trayInit} from "@main/app/app.tray";
import {GroupItemController} from "@main/controller/groupItem.controller";
import installExtension from 'electron-devtools-installer'
import {UserController} from "@main/controller/user.controller";
import {getNetworkInfo, getUserAppDataFolder} from "@common/utils/utils";
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
    } else {
        //开机自启功能
        //app.isReady() ? launchAtStartup() : app.on("ready", launchAtStartup);
    }

    ///应用启动后的操作
    app.whenReady().then(async () => {
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
            controllers: [AppController, PwdGroupController, GroupItemController, UserController],
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
             PwdGroup.hasMany(GroupItem)
             GroupItem.belongsTo(PwdGroup)
             await GroupItem.sync({alter: true})//添加外键*/

            /*            const user =  await SysUser.findByPk('42b081f4-65d6-478f-b35e-3b31d72644d3')
                        log.log(user.id)*/
        }).catch(err => {
            log.error('=================Database connection failed :( ===================', err);
        });

    } catch (error) {
        log.error(error)
        app.quit()
    }
}

bootstrap()

function launchAtStartup() {
    const exeName = path.basename(process.execPath);
    if (process.platform === "darwin") {
        app.setLoginItemSettings({
            openAtLogin: true,
            openAsHidden: true
        });
    } else {
        app.setLoginItemSettings({
            openAtLogin: true,
            openAsHidden: true,
            path: process.execPath,
            args: [
                "--processStart", `"${exeName}"`,
                "--process-start-args", `"--hidden"`
            ]
        });
    }
}

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
