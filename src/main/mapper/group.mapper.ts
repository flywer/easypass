import {Injectable} from "einf";
import {Group, IGroupVo} from "@main/model/group";
import {sequelize} from "@main/sequelize.init";
import {Op} from "sequelize"
import {sqlLikePack} from "@common/utils/utils";
import {IUserVo} from "@main/model/user";

@Injectable()
export class GroupMapper {
    constructor() {
    }

    /**
     * 通过用户ID查询全部信息
     * @param user
     */
    public async getGroupListByUserId(user:IUserVo) {
        return await Group.findAll({
            order: ['groupIndex'],
            where: {
                userId: user.id
            }
        })
    }

    /**
     * 通过组ID获取信息
     * @param groupId
     */
    public async getGroupById(groupId: string) {
        return await Group.findByPk(groupId)
    }

    /**
     * 保存
     * @param group
     */
    public async saveGroup(group: IGroupVo) {
        await sequelize.transaction(() => {
            return Group.create(group)
        })
    }

    /**
     * 通过ID更新
     * @param group
     */
    public async updateGroup(group: IGroupVo) {
        await Group.update(group, {
            where: {
                id: group.id
            }
        })
    }

    /**
     * 分页查询
     * @param group
     */
    public async getGroupListByUserInfoByPage(group: IGroupVo) {
        const {count, rows} = await Group.findAndCountAll({
            where: {
                [Op.and]: {
                    name: {
                        [Op.like]: sqlLikePack(group.name, true, true)
                    },
                    userId: group.userId
                }
            },
            offset: (group.pageIndex - 1) * group.pageSize,
            limit: group.pageSize,
            order: ['groupIndex']
        })
        return {rows, count}
    }

    /**
     * 根据ID删除
     * @param groupId
     */
    public async deleteGroupById(groupId:string) {
        await Group.destroy({
            where: {
                id: groupId
            }
        })
    }
}
