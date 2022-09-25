import {app, Tray, Menu, nativeImage} from 'electron'
import {createEinf} from 'einf'
import {AppController} from './controller/app.controller'
import {createWindow} from './main.window'
import {sequelizeInit, sequelize} from "@main/sequelize.init";
import {User} from "@main/model/user";
import {PwdGroup} from "@main/model/pwdGroup";
import {logger} from "sequelize/types/utils/logger";
import {databaseInit} from "@main/mapper/defaultSql";
import {PwdMgtController} from "@main/controller/pwdMgt.controller";
import {GroupItem} from "@main/model/groupItem";
import path from "path";
import {trayInit} from "@main/app/app.tray";
import {User2} from "@main/model/user2";

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

async function electronAppInit() {
    const isDev = !app.isPackaged

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
    app.whenReady().then(() => {
        trayInit()
    })

}

const appFolder = path.dirname(process.execPath);

//const updateExe = path.resolve(appFolder, "..", "Update.exe");

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
 * 启动主进程时在这里进行初始化操作
 * Initialize here when starting the main process
 */
async function bootstrap() {
    try {
        await electronAppInit()

        await createEinf({
            window: createWindow,
            controllers: [AppController, PwdMgtController],
            injects: [{
                name: 'IS_DEV',
                inject: !app.isPackaged,
            }],
        })


        //验证是否连接成功
        sequelize.authenticate().then(async () => {
            console.log('===================Database connection succeeded :) ================');
            //await databaseInit()

            /* await GroupItem.sync({force:true})
             //密码组与组项是一对多的关系
             PwdGroup.hasMany(GroupItem)
             GroupItem.belongsTo(PwdGroup)
             await GroupItem.sync({alter: true})//添加外键*/

        }).catch(err => {
            console.error('=================Database connection failed :( ===================', err);
        });

    } catch (error) {
        console.error(error)
        app.quit()
    }
}

bootstrap()
