import {DataTypes, Options, Sequelize} from "sequelize";
import log from 'electron-log'
import path from "path";
import {getAppSettings, getAppDataPath, getDataSourceSettings, getAppDbStat} from "@common/utils/utils";
import config from "@common/config/appConfig.json";
import {isEqual} from "lodash";
import {constant} from "lodash-es";

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
    /*通过数据源ID获取当前激活的数据源*/
    const dsId = (await getAppDbStat()).currentDSId
    let curDS = dataSourceSettings.filter(item => isEqual(item.id, dsId)).at(0)
    if (isEqual(curDS.dialect, 'sqlite')) {
        sequelize = new Sequelize({dialect: 'sqlite', storage: curDS.storage})
    } else if (isEqual(curDS.dialect, 'mysql')) {
        sequelize = new Sequelize(curDS.database, curDS.username, curDS.password, {
            host:curDS.hostname,
            dialect: curDS.dialect,
            port:curDS.port
        })
    }

    //sequelize = new Sequelize(commonDb.database,commonDb.username,commonDb.password,commonDb.options as Options)
    log.log('Sequelize init success :)')
    return sequelize
}

//实例
export let sequelize = sequelizeInit();




