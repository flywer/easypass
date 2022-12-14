import {Injectable} from "einf";
import {sequelize} from "@main/sequelize.init";
import {GroupItem, IGroupItemVo, itemTypeEnum} from "@main/model/groupItem";
import {Op} from "sequelize";

@Injectable()
export class GroupItemMapper {
    constructor() {
    }

    public async saveOrUpdateGroupItems(groupItems: typeof GroupItem[]) {
        return await sequelize.transaction(async () => {
            return await GroupItem.bulkCreate(groupItems, {
                updateOnDuplicate:
                    ['name', 'value', 'type', 'isTitle', 'isAccount', 'isPassword', 'isShow', 'itemIndex']
            })
        })
    }

    public async getItemsIdListByPage(groupItem) {
        const {count, rows} = await GroupItem.findAndCountAll({
            attributes: ['itemId'],
            where: {
                [Op.and]: {
                    groupId: groupItem.groupId,
                    type: itemTypeEnum.title
                }
            },
            group: 'itemId',
            offset: (groupItem.pageIndex - 1) * groupItem.pageSize,
            limit: groupItem.pageSize
        })
        return {rows, count}
    }

    public async getCommonGroupItemsListByPage(groupItem: IGroupItemVo, groupIdList) {
        const {count, rows} = await GroupItem.findAndCountAll({
            attributes: ['itemId'],
            where: {
                [Op.and]: {
                    type: itemTypeEnum.title,
                    isCommon: 1,
                    groupId: groupIdList
                }
            },
            group: 'itemId',
            offset: (groupItem.pageIndex - 1) * groupItem.pageSize,
            limit: groupItem.pageSize
        })
        return {rows, count}
    }

    public async getAllItemsTitleList(isCommon: boolean, groupIdList) {
        return await GroupItem.findAll({
            attributes: ['itemId', 'value'],
            where: {
                type: itemTypeEnum.title,
                isCommon: isCommon ? 1 : [1, 0],
                groupId: groupIdList
            }
        })
    }

    public async getItemsListByItemId(itemId: string) {
        return await GroupItem.findAll({
            where: {
                itemId: itemId
            },
            order: ['itemIndex']
        })
    }

    public async getItemsListByGroupId(groupId: string) {
        return await GroupItem.findAll({
            where: {
                groupId: groupId
            },
            order: ['itemIndex']
        })
    }

    public async getItemsIdListByGroupId(groupId: string) {
        return await GroupItem.findAll({
            attributes: ['itemId'],
            where: {
                groupId: groupId
            },
            group: 'itemId'
        })
    }


    public async deleteGroupItemByItemId(itemId: string) {
        await GroupItem.destroy({
            where: {
                itemId: itemId
            }
        })
    }

    public async deleteGroupItemsByGroupId(id) {
        await GroupItem.destroy({
            where: {
                groupId: id
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
                type: itemTypeEnum.title,
                itemId: itemId
            }
        })
    }

    public async updateGroupIdByItemId(groupItem: IGroupItemVo) {
        await GroupItem.update({groupId: groupItem.groupId}, {
            where: {
                itemId: groupItem.itemId
            }
        })
    }
}

