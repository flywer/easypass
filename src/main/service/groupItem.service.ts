import {Injectable} from "einf";
import {GroupItemMapper} from "@main/mapper/groupItem.mapper";
import {IGroupItemVo, itemTypeEnum} from "@main/model/groupItem";
import {uuid} from "vue3-uuid";
import {encrypt, groupItemDecrypt} from "@common/utils/cryptoUtils";
import {isEqual} from "lodash";

@Injectable()
export class GroupItemService {
    constructor(private groupItemMapper: GroupItemMapper) {
    }

    public async getItemsIdListByPage(groupItem: IGroupItemVo) {
        const data = await this.groupItemMapper.getItemsIdListByPage(groupItem)
        return {
            rows: data.rows.map(item => item.dataValues),
            count: data.count.length
        }
    }

    public async getCommonGroupItemsListByPage(groupItem: IGroupItemVo, groupIdList) {
        const data = await this.groupItemMapper.getCommonGroupItemsListByPage(groupItem, groupIdList)
        return {
            rows: data.rows.map(item => item.dataValues),
            count: data.count.length
        }
    }

    public async getAllItemsTitleListByPage(groupItem:IGroupItemVo, groupIdList,isCommon) {
        //全量搜索所有常用账号组标题
        let allItemTitleList = await this.groupItemMapper.getAllItemsTitleList(isCommon, groupIdList)
        let searchedList = []
        for (const item of allItemTitleList) {
            const decryptData = groupItemDecrypt(item.value)
            if (decryptData.includes(groupItem.value) || decryptData.toLowerCase().includes(groupItem.value.toLowerCase())) {
                searchedList.push(item)
            }
        }
        return {
            rows: searchedList.slice((groupItem.pageIndex - 1) * groupItem.pageSize, groupItem.pageSize).map(item => item.dataValues),
            count: searchedList.length
        }
    }

    public async getItemsListByItemId(itemId: string) {
        let list = []
        //解密
        for (const item of (await this.groupItemMapper.getItemsListByItemId(itemId))) {
            let dataValues = item.dataValues
            dataValues.value = groupItemDecrypt(dataValues.value)
            list.push(dataValues)
        }
        return list
    }

    public saveOrUpdateGroupItems(groupItems: IGroupItemVo[], groupId: string, isUpdate: boolean) {
        //相同账号组有同一个组ID
        let itemId
        if (isUpdate)
            itemId = groupItems.filter(item => isEqual(item.type, itemTypeEnum.title)).at(0).itemId
        else
            itemId = uuid.v4()

        groupItems.forEach((item, index) => {
            item.itemId = itemId
            item.groupId = groupId
            item.itemIndex = index + 1
            const encryptData = encrypt(item.value)
            item.value = encryptData.iv + encryptData.content
        })
        return this.groupItemMapper.saveOrUpdateGroupItems(groupItems)
    }

    public async setGroupItemCommon(itemId: string, isCommon: string) {
        await this.groupItemMapper.setGroupItemCommon(itemId, isCommon)
    }

    public async deleteGroupItemByItemId(itemId: string) {
        await this.groupItemMapper.deleteGroupItemByItemId(itemId)
    }

    public async deleteGroupItemsByGroupId(id) {
        await this.groupItemMapper.deleteGroupItemsByGroupId(id)
    }

    public async deleteItemById(id) {
        await this.groupItemMapper.deleteItemById(id)
    }


    public async updateGroupIdByItemId(groupItem: IGroupItemVo) {
        await this.groupItemMapper.updateGroupIdByItemId(groupItem)
    }
}
