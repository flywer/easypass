import {app, dialog} from 'electron'
import {createEinf} from 'einf'
import {AppController} from './controller/app.controller'
import {createWindow} from './main.window'
import {sequelize} from "@main/sequelize.init";
import {GroupController} from "@main/controller/group.controller";
import {trayInit} from "@main/app/app.tray";
import {GroupItemController} from "@main/controller/groupItem.controller";
import installExtension from 'electron-devtools-installer'
import {UserController} from "@main/controller/user.controller";
import {getAppDataPath, getAppDbStat, getAppPath, getAppProxySettings, getAppSettings} from "@common/utils/utils";
import log from 'electron-log'
import {groupInit} from "@main/model/group";
import {GroupItemInit} from "@main/model/groupItem";
import {UserInit} from "@main/model/user";
import {databaseInit} from "@main/mapper/databaseInit";
import {isEqual, isNull} from "lodash";
import {appLogInit} from "@main/app/app.log";
import fs from "fs";
import {join} from "path";
import {AppSettingsController} from "@main/controller/app.settings.controller";
import {AppWindowController} from "@main/controller/app.window.controller";
import {AppUpdaterController} from "@main/controller/app.updater.controller";
import {AppDataSourceController} from "@main/controller/app.dataSource.controller";

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

async function electronAppInit() {
    const isDev = !app.isPackaged

    //禁用硬件加速技术
    //app.disableHardwareAcceleration()
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
            //log.info('网络代理设置成功，代理地址为：' + server)
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
        appLogInit()

        appDataFolderInit()

        await electronAppInit()

        await createEinf({
            window: createWindow,
            controllers: [
                AppController,
                AppSettingsController,
                AppWindowController,
                AppUpdaterController,
                AppDataSourceController,
                GroupController,
                GroupItemController,
                UserController
            ],
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
            let appBdStat = await getAppDbStat()
            if (appBdStat.shouldInit) {
                await databaseInit(appBdStat.alter, appBdStat.force)
            }
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
        dialog.showMessageBox({
            type: 'error',
            title: '程序初始化失败',
            message: error.toString(),
            buttons: ['ok']
        }).then(() => {
            app.quit()
        })

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

/**
 * 创建config文件夹，防止不存在报错
 */
function appDataFolderInit() {
    fs.mkdir(join(getAppDataPath(), 'config'), {recursive: true}, (error) => {
        if (error) log.error(error)
    })
}
