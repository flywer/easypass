import {Sequelize} from "sequelize";

/* 选择 'mysql' | 'mariadb' | 'postgres' | 'mssql' 其一 */

//实例
export const sequelize = new Sequelize('easypass', 'hyq', '147896325q!', {
    host: 'rm-2zer84p8izdqu3x8ngo.mysql.rds.aliyuncs.com',
    dialect: "mysql",
    dialectOptions: {
        charset: 'utf8mb4',
        collate: 'utf8_general_ci',
    },
    timezone: '+08:00'
});



