import {User} from "@main/model/user";
import {PwdGroup} from "@main/model/pwdGroup"
import {sequelize} from "@main/mysql";

/**
 * 数据库初始化
 */
export const datableInit = async () => {
    try {
        await sequelize.transaction(async (t) => {

            //密码组信息表结构初始化
            await PwdGroup.sync({force: true})

            //用户信息表结构初始化
            await User.sync({force: true})

            //用户与密码组是一对多的关系
            User.hasMany(PwdGroup)
            PwdGroup.belongsTo(User)
            await PwdGroup.sync({alter: true})//添加外键

            //默认值
            const user = await User.create({
                name: '小白'
            })
            await PwdGroup.create({
                name: '默认',
                userId: user.get('id')
            })

            console.log("database init succeeded :)")
        });
    } catch (error) {
        throw new Error("database init failed :(")
    }
}
