import {Group} from "@main/model/group"
import {sequelize} from "@main/sequelize.init";
import {GroupItem} from "@main/model/groupItem";
import {User} from "@main/model/user";
import log from 'electron-log'

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

            //用户与密码组是一对多的关系
            //User.hasMany(Group)
            //Group.belongsTo(User)
            //await Group.sync({alter: true})//添加外键

            //密码组与组项是一对多的关系
            //Group.hasMany(GroupItem)
            //GroupItem.belongsTo(Group)
            //await GroupItem.sync({alter: true})//添加外键

            log.log("database init succeeded :)")
        });
    } catch (error) {
        log.error(error)
        throw new Error("database init failed :( :" + error)
    }
}
