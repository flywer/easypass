
import {PwdGroup} from "@main/model/pwdGroup"
import {sequelize} from "@main/sequelize.init";
import {GroupItem} from "@main/model/groupItem";
import {SysUser} from "@main/model/sysUser";

/**
 * 数据库初始化
 */
export const databaseInit = async () => {
    try {
        await sequelize.transaction(async (t) => {

            //密码组信息表结构初始化
            await PwdGroup.sync({force: true})

            //用户信息表结构初始化
            await SysUser.sync({force: true})

            //用户与密码组是一对多的关系
            SysUser.hasMany(PwdGroup)
            PwdGroup.belongsTo(SysUser)
            await PwdGroup.sync({alter: true})//添加外键

            //默认值
            const user = await SysUser.create({
                name: '小白'
            })
            await PwdGroup.create({
                name: '默认',
                userId: user.get('id')
            })


            await GroupItem.sync({force: true})
            //密码组与组项是一对多的关系
            PwdGroup.hasMany(GroupItem)
            GroupItem.belongsTo(PwdGroup)
            await GroupItem.sync({alter: true})//添加外键

            console.log("database init succeeded :)")
        });
    } catch (error) {
        throw new Error("database init failed :( :" + error)
    }
}
