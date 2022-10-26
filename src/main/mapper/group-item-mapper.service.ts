import {Injectable} from "einf";
import {sequelize} from "@main/sequelize.init";
import {GroupItem} from "@main/model/groupItem";
import {Op} from "sequelize";
import {sqlLikePack} from "@common/utils/utils";

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

    public async getCommonGroupItemsListByPage(vo) {
        const {count, rows} = await GroupItem.findAndCountAll({
            attributes: ['itemId'],
            where: {
                [Op.and]: {
                    isTitle: 1,
                    isCommon: 1
                }
            },
            group: 'itemId',
            offset: (vo.pageIndex - 1) * vo.pageSize,
            limit: vo.pageSize
        })
        return {rows, count}
    }

    public async getAllItemsTitleList(isCommon: boolean) {
        return await GroupItem.findAll({
            attributes: ['itemId', 'value'],
            where: {
                isTitle: 1,
                isCommon: isCommon ? 1 : 0
            }
        })
    }


    /*    public async getItemsTitleList(vo) {
            const {count, rows} = await GroupItem.findAndCountAll({
                attributes: ['itemId', 'value'],
                where: {
                    [Op.and]: {
                        value: {
                            [Op.like]: sqlLikePack(vo.value, true, true)
                        },
                        isTitle: 1,
                        isCommon: 1
                    }
                },
                offset: (vo.pageIndex - 1) * vo.pageSize,
                limit: vo.pageSize
            })
            return {rows, count}
        }*/


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

    public async deleteGroupItemByGroupId(id) {
        await GroupItem.destroy({
            where: {
                pwdGroupId: id
            }
        })
    }

    public async deleteItemById(id) {
        await GroupItem.destroy({
            where: {
                id: id
            }
        })
    }

    public async setGroupItemCommon(itemId: string, isCommon: string) {
        await GroupItem.update({isCommon: isCommon}, {
            where: {
                isTitle: true,
                itemId: itemId
            }
        })
    }
}

