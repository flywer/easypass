import {Injectable} from "einf";
import {sequelize} from "@main/sequelize.init";
import {GroupItem} from "@main/model/groupItem";
import {Op} from "sequelize";
import {sqlLikePack} from "@main/utils";
import {PwdGroup} from "@main/model/pwdGroup";

@Injectable()
export class GroupItemMapper {
    constructor() {
    }

    public async saveOrUpdateGroupItems(groupItems: typeof GroupItem[]) {
        return await sequelize.transaction(async () => {
            return await GroupItem.bulkCreate(groupItems, {
                updateOnDuplicate:
                    ['name', 'value', 'isTitle', 'isAccount', 'isPassword', 'isShow', 'itemIndex']
            })
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

    public async getItemsListByItemId(itemId: string) {
        return await GroupItem.findAll({
            where: {
                itemId: itemId
            },
            order: ['itemIndex']
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

    public async updateGroupItems(groupItems: typeof GroupItem[]) {
        await sequelize.transaction(() => {
            GroupItem.update()
        })
    }

    public async deleteItemById(id) {
        await GroupItem.destroy({
            where: {
                id: id
            }
        })
    }
}

