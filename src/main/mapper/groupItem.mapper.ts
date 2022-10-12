import {Injectable} from "einf";
import {sequelize} from "@main/sequelize.init";
import {GroupItem} from "@main/model/groupItem";
import {Op} from "sequelize";
import {sqlLikePack} from "@main/utils";
import {PwdGroup} from "@main/model/pwdGroup";

@Injectable()
export class groupItemMapper {
    constructor() {
    }

    public async saveGroupItems(groupItems: typeof GroupItem[]) {
        return await sequelize.transaction(() => {
            return GroupItem.bulkCreate(groupItems)
        })
    }

    public async getItemsIdListByPage(vo) {
        const {count, rows} = await GroupItem.findAndCountAll({
            attributes: ['itemId'],
            where: {
                [Op.and]: {
                    value: {
                        [Op.like]: sqlLikePack(vo.value, true, true)
                    },
                    pwdGroupId: vo.groupId,
                    isTitle: 1
                }
            },
            group: 'itemId',
            offset: (vo.pageIndex - 1) * vo.pageSize,
            limit: vo.pageSize
        })
        return {rows, count}
    }

    public async getItemsTitleList(vo) {
        const {count, rows} = await GroupItem.findAndCountAll({
            attributes: ['itemId', 'value'],
            where: {
                [Op.and]: {
                    value: {
                        [Op.like]: sqlLikePack(vo.value, true, true)
                    },
                    pwdGroupId: vo.groupId,
                    isTitle: 1
                }
            },
            offset: (vo.pageIndex - 1) * vo.pageSize,
            limit: vo.pageSize
        })
        return {rows, count}
    }

    public async getItemsByItemId(itemId: string) {
        return await GroupItem.findAll({
            where: {
                itemId: itemId
            }
        })
    }

    public async deleteGroupItemByItemId(itemId: string) {
        await GroupItem.destroy({
            where: {
                itemId: itemId
            }
        })
    }

    public async deleteGroupItemByGroupId(id: string) {
        await GroupItem.destroy({
            where: {
                pwdGroupId: id
            }
        })
    }
}

