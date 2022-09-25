import {Injectable} from "einf";
import {PwdGroup, PwdGroupVo} from "@main/model/pwdGroup";
import {sequelize} from "@main/sequelize.init";
import {Op, UUIDV4} from "sequelize"
import {sqlLikePack} from "@main/utils";
import {GroupedCountResultItem} from "sequelize/types/model";

@Injectable()
export class pwdGroupMapper {
    constructor() {
    }

    public getPwdGroupListByUserInfo(user: {}) {
        try {
            return PwdGroup.findAll({
                order: ['groupIndex']
            }).then(res => {
                return res
            })
        } catch (error) {
            return null
        }
    }

    public getPwdGroupById(groupId: string) {
        try {
            return PwdGroup.findOne({
                where: {
                    id: groupId
                }
            })
        } catch (e) {
            return null
        }
    }

    public async savePwdGroup(pwdGroup: PwdGroup): Promise<PwdGroup> {
        try {
            return await sequelize.transaction((t) => {
                pwdGroup.id = UUIDV4.toString()
                return PwdGroup.create(pwdGroup)
            })
        } catch (error) {
            return null
        }
    }

    public async getPwdGroupListByUserInfoByPage(vo: PwdGroupVo): Promise<{ rows: []; count: GroupedCountResultItem[] }> {
        try {
            const {count, rows} = await PwdGroup.findAndCountAll({
                where: {
                    name: {
                        [Op.like]: sqlLikePack(vo.name, true, true)
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

}
