import {Sequelize} from "sequelize";
import log from 'electron-log'
import {getDataSourceSettings, getAppDbStat} from "@common/utils/utils";
import {isEqual} from "lodash";

/* 选择 'mysql' | 'mariadb' | 'postgres' | 'mssql' | 'sqlite'其一 */
export const sequelizeInit = async () => {
    let dataSourceSettings = await getDataSourceSettings()
    /*通过数据源ID获取当前激活的数据源*/
    const dsId = (await getAppDbStat()).currentDSId
    let curDS = dataSourceSettings.filter(item => isEqual(item.id, dsId)).at(0)
    if (isEqual(curDS.dialect, 'sqlite')) {
        sequelize = new Sequelize({dialect: 'sqlite', storage: curDS.storage})
    } else if (isEqual(curDS.dialect, 'mysql') || isEqual(curDS.dialect, 'mariadb')) {
        sequelize = new Sequelize(curDS.database, curDS.username, curDS.password, {
            host: curDS.hostname,
            dialect: curDS.dialect,
            port: curDS.port
        })
    }

    log.log('Sequelize init success :)')
    return sequelize
}

//实例
export let sequelize = sequelizeInit();




