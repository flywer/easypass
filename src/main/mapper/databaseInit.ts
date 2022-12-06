import {Group} from "@main/model/group"
import {sequelize} from "@main/sequelize.init";
import {GroupItem} from "@main/model/groupItem";
import {User} from "@main/model/user";
import log from 'electron-log'
import {dialog} from "electron";

/**
 * 数据库初始化  alter=false,force=false 如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
 * @param alter alter=true 这将检查数据库中表的当前状态(它具有哪些列,它们的数据类型等),然后在表中进行必要的更改以使其与模型匹配.
 * @param force  force=true 将创建表,如果表已经存在,则将其首先删除
 */
export const databaseInit = async (alter?: boolean, force?: boolean) => {
    if (typeof (alter) === 'undefined') alter = false
    if (typeof (force) === 'undefined') force = false
    try {
        await sequelize.transaction(async (t) => {
            if (!alter && !force) {
                await User.sync()
                await Group.sync()
                await GroupItem.sync()
            } else if (alter && !force) {
                await User.sync({alter: true})
                await Group.sync({alter: true})
                await GroupItem.sync({alter: true})
            } else if (force && !alter) {
                await User.sync({force: true})
                await Group.sync({force: true})
                await GroupItem.sync({force: true})
            } else if (alter && force) {
                await User.sync({alter: true, force: true})
                await Group.sync({alter: true, force: true})
                await GroupItem.sync({alter: true, force: true})
            }
            log.info("database init succeeded :)")
        });
    } catch (error) {
        log.error(error)
        dialog.showMessageBox({
            type: 'error',
            title: '数据库初始化失败',
            message: error.toString(),
            buttons: ['ok']
        })
    }
}
