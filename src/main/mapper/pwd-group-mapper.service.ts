import {Injectable} from "einf";
import {PwdGroup, PwdGroupVo} from "@main/model/pwdGroup";
import {sequelize} from "@main/sequelize.init";
import {Op, UUIDV4} from "sequelize"
import {sqlLikePack} from "@common/utils/utils";
import {GroupedCountResultItem} from "sequelize/types/model";

@Injectable()
export class PwdGroupMapper {
    constructor() {
    }

    public getPwdGroupListByUserInfo(user) {
        try {
            return PwdGroup.findAll({
                order: ['groupIndex'],
                where: {
                    userId: user.id
                }
            }).then(res => {
                return res
            })
        } catch (error) {
            return null
        }
    }

    public async getPwdGroupById(groupId: string) {
        try {
            return await PwdGroup.findByPk(groupId)
        } catch (e) {
            return null
        }
    }

    public async savePwdGroup(pwdGroup: typeof PwdGroup) {
        await sequelize.transaction(() => {
            return PwdGroup.create(pwdGroup)
        })
    }

    public async updatePwdGroup(pwdGroup: typeof PwdGroup) {
        await PwdGroup.update(pwdGroup, {
            where: {
                id: pwdGroup.id
            }
        })
    }

    public async getPwdGroupListByUserInfoByPage(vo): Promise<{ rows: []; count: GroupedCountResultItem[] }> {
        try {
            const {count, rows} = await PwdGroup.findAndCountAll({
                where: {
                    [Op.and]: {
                        name: {
                            [Op.like]: sqlLikePack(vo.name, true, true)
                        },
                        userId: vo.userId //[sequelize.literal(`select id from sys_user where  mac = '${vo.mac}' `)]
                    }
                },
                offset: (vo.pageIndex - 1) * vo.pageSize,
                limit: vo.pageSize,
                order: ['groupIndex']
            })
            return {rows, count}
        } catch (error) {
            throw new Error(error)
        }
    }

    public async deleteGroupById(id) {
        await PwdGroup.destroy({
            where: {
                id: id
            }
        })
    }
}
