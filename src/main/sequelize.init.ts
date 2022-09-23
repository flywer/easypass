import {DataTypes, Options, Sequelize} from "sequelize";
import {GroupItem, groupItemInit} from "@main/model/groupItem";
import {userInit} from "@main/model/user";
import {pwdGroupInit} from "@main/model/pwdGroup";

/* 选择 'mysql' | 'mariadb' | 'postgres' | 'mssql' 其一 */


//new Sequelize('easypass', 'hyq', '147896325q!', {});

export const sequelizeInit = (database: string, username: string, password: string, options: Options) => {
    options = {
        host: 'rm-2zer84p8izdqu3x8ngo.mysql.rds.aliyuncs.com',
        dialect: "mysql",
        dialectOptions: {
            charset: 'utf8mb4',
            collate: 'utf8_general_ci',
        },
        timezone: '+08:00'
    }

    sequelize = new Sequelize(database, username, password, options)

    console.log('===================sequelizeInit====================')
    userInit()
    pwdGroupInit()
    groupItemInit()

    return sequelize
}

//实例
export let sequelize = sequelizeInit('easypass', 'hyq', '147896325q!', {});




