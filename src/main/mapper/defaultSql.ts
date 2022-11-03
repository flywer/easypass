import {Group} from "@main/model/group"
import {sequelize} from "@main/sequelize.init";
import {GroupItem} from "@main/model/groupItem";
import {User} from "@main/model/user";
import log from 'electron-log'
import {dialog} from "electron";

/**
 * 数据库初始化
 */
export const databaseInit = async () => {
    try {
        await sequelize.transaction(async (t) => {
            //用户信息表结构初始化
            await User.sync()
            //组信息表结构初始化
            await Group.sync()
            //组项信息表结构初始化
            await GroupItem.sync()
            log.info("database init succeeded :)")
        });
    } catch (error) {
        log.error(error)
        dialog.showMessageBox({
            type: 'error',
            title: '数据库初始化失败',
            message: error,
            buttons: ['ok']
        })
    }
}
