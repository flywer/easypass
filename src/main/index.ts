import {app, BrowserWindow, dialog} from 'electron'
import {createEinf} from 'einf'
import {AppController} from './controller/app.controller'
import {createWindow} from './main.window'
import {sequelize} from "@main/sequelize.init";
import {GroupController} from "@main/controller/group.controller";
import {trayInit} from "@main/app/app.tray";
import {GroupItemController} from "@main/controller/groupItem.controller";
import installExtension from 'electron-devtools-installer'
import {UserController} from "@main/controller/user.controller";
import {getAppProxySettings, getAppSettings, getUserAppDataFolder} from "@common/utils/utils";
import log from 'electron-log'
import * as Path from "path";
import {groupInit} from "@main/model/group";
import {GroupItemInit} from "@main/model/groupItem";
import {UserInit} from "@main/model/user";
import {databaseInit} from "@main/mapper/defaultSql";
import {isEqual, isNull} from "lodash";
import {sendEmail} from "@common/utils/mailer";

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
//设置日志存储位置
log.transports.file.resolvePath = () => Path.join(getUserAppDataFolder(), 'logs/main.log')

async function electronAppInit() {
    const isDev = !app.isPackaged

    //禁用硬件加速技术
    app.disableHardwareAcceleration()
    //应用单例运行，不可存在多个同时运行
    if (!app.requestSingleInstanceLock()) app.quit();

    //设置操作系统全局名称
    app.setAppUserModelId('EasyPass')

    //region 应用全局网络代理
    const proxySettings = await getAppProxySettings()
    if (isEqual(proxySettings.proxyMode, '01')) {
        app.commandLine.appendSwitch('no-proxy-server')
        log.info('无网络代理')
    } else {
        if (!isNull(proxySettings.model)) {
            const model = proxySettings.model
            let server
            if (isEqual(model.proxyType, '01')) {
                server = 'http://' + model.hostname + ':' + model.port
            } else {
                server = 'socks5://' + model.hostname + ':' + model.port
            }
            app.commandLine.removeSwitch('no-proxy-server')
            app.commandLine.appendSwitch('proxy-server', server);
            app.commandLine.appendSwitch('proxy-bypass-list', model.bypassList)
            log.info('网络代理设置成功，代理地址为：' + server)
        }
    }
    //endregion

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
            log.info('Database connection succeeded :) ');
            groupInit()
            GroupItemInit()
            UserInit()
            await databaseInit()
        }).catch(err => {
            log.error('Database connection failed :( ', err);
            dialog.showMessageBox({
                type: 'error',
                title: '数据库连接失败',
                message: err.toString(),
                buttons: ['ok']
            })
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
        log.error('Vue Devtools failed to install:', e)
    }
}
