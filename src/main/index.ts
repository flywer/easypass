import {app} from 'electron'
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

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

async function electronAppInit() {
    const isDev = !app.isPackaged
    app.on('window-all-closed', () => {
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
        }).catch(err => {
            console.error('=================Database connection failed :( ===================', err);
        });

    } catch (error) {
        console.error(error)
        app.quit()
    }
}

bootstrap()
