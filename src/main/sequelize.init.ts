import {DataTypes, Options, Sequelize} from "sequelize";
import log from 'electron-log'
import path from "path";
import {getAppSettings, getUserAppDataFolder} from "@common/utils/utils";
import config from "@common/config/appConfig.json";
import {isEqual} from "lodash";

const defaultMode = config.loginMode /*目前默认为跨平台*/

const commonDb = {
    database: 'easypass',
    username: 'hyq',
    password: '147896325q!',
    options: {
        host: 'rm-2zer84p8izdqu3x8ngo.mysql.rds.aliyuncs.com',
        dialect: "mysql",
        dialectOptions: {
            charset: 'utf8mb4'
        },
        timezone: '+08:00'
    }
}

const localDb = {
    dialect: 'sqlite',
    storage: path.join(getUserAppDataFolder(), '/local/db.sqlite')
}


/* 选择 'mysql' | 'mariadb' | 'postgres' | 'mssql' | 'sqlite'其一 */
export const sequelizeInit = async (database: string, username: string, password: string, options: Options) => {
    const appSettings = await getAppSettings()
    if (typeof (appSettings.loginMode) == 'undefined') {
        log.info('默认登录模式：', defaultMode)
        //默认
        if (isEqual(defaultMode, '01'))
            sequelize = new Sequelize(localDb as Options)
        else
            sequelize = new Sequelize(commonDb.database, commonDb.username, commonDb.password, commonDb.options as Options)
    } else {
        log.info('登录模式：', appSettings.loginMode)
        if (isEqual(appSettings.loginMode, '01'))
            sequelize = new Sequelize(localDb as Options)
        else
            sequelize = new Sequelize(commonDb.database, commonDb.username, commonDb.password, commonDb.options as Options)
    }

    log.log('===================sequelize init success :)====================')
    return sequelize
}

//实例
export let sequelize = sequelizeInit('easypass', 'hyq', '147896325q!', {});




