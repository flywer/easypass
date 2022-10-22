import {DataTypes, Options, Sequelize} from "sequelize";
import log from 'electron-log'

/* 选择 'mysql' | 'mariadb' | 'postgres' | 'mssql' 其一 */
export const sequelizeInit = (database: string, username: string, password: string, options: Options) => {
    options = {
        host: 'rm-2zer84p8izdqu3x8ngo.mysql.rds.aliyuncs.com',
        dialect: "mysql",
        dialectOptions: {
            charset: 'utf8mb4'
        },
        timezone: '+08:00'
    }

    sequelize = new Sequelize(database, username, password, options)
    log.log('===================sequelize init success :)====================')
    return sequelize
}

//实例
export let sequelize = sequelizeInit('easypass', 'hyq', '147896325q!', {});




