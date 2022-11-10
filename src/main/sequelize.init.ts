import {DataTypes, Options, Sequelize} from "sequelize";
import log from 'electron-log'
import path from "path";
import {getAppSettings, getAppDataPath, getDataSourceSettings, getAppDbStat} from "@common/utils/utils";
import config from "@common/config/appConfig.json";
import {isEqual} from "lodash";

const defaultMode = config.loginMode /*目前默认为跨平台*/

const commonDb = {
    database: 'easy_pass',
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

/* 选择 'mysql' | 'mariadb' | 'postgres' | 'mssql' | 'sqlite'其一 */
export const sequelizeInit = async () => {

    let dataSourceSettings = await getDataSourceSettings()
    let curDb = dataSourceSettings.at((await getAppDbStat()).currentDb)
    if (isEqual(curDb.dialect, 'sqlite')) {
        sequelize = new Sequelize({dialect: 'sqlite', storage: curDb.storage})
    } else if (isEqual(curDb.dialect, 'mysql')) {
        sequelize = new Sequelize(curDb.database, curDb.username, curDb.password, curDb.options as Options)
    }

    /*    const appSettings = await getAppSettings()

        if (typeof (appSettings.loginMode) == 'undefined') {
            //log.info('默认登录模式：', defaultMode)
            //默认
            if (isEqual(defaultMode, '01'))
                sequelize = new Sequelize(defaultLocalSqliteDb as Options)
            else
                sequelize = new Sequelize(commonDb.database, commonDb.username, commonDb.password, commonDb.options as Options)
        } else {
            //log.info('登录模式：', appSettings.loginMode)
            if (isEqual(appSettings.loginMode, '01'))
                sequelize = new Sequelize(defaultLocalSqliteDb as Options)
            else
                sequelize = new Sequelize(commonDb.database, commonDb.username, commonDb.password, commonDb.options as Options)
        }*/

    log.log('Sequelize init success :)')
    return sequelize
}

//实例
export let sequelize = sequelizeInit();




