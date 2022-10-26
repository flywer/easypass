import {Injectable} from "einf";
import {GroupItemMapper} from "@main/mapper/group-item-mapper.service";
import {GroupItem} from "@main/model/groupItem";
import {uuid} from "vue3-uuid";
import {decrypt, encrypt, groupItemDecrypt} from "@common/utils/cryptoUtils";

@Injectable()
export class GroupItemService {
    constructor(private groupItemMapper: GroupItemMapper) {
    }

    public saveOrUpdateGroupItems(groupItems: typeof GroupItem[], groupId: string, isUpdate: boolean) {
        //相同账号组有同一个组ID
        let itemId
        if (isUpdate)
            itemId = groupItems.filter(item => item.isTitle == true).at(0).itemId
        else
            itemId = uuid.v4()
        groupItems.forEach((item) => {
            item.itemId = itemId
            item.pwdGroupId = groupId
            const encryptData = encrypt(item.value)
            item.value = encryptData.iv + encryptData.content
        })
        return this.groupItemMapper.saveOrUpdateGroupItems(groupItems)
    }

    /*    public getItemsTitleList(vo) {
            return this.groupItemMapper.getItemsTitleList(vo)
        }*/

    public async getItemsIdListByPage(vo) {
        return await this.groupItemMapper.getItemsIdListByPage(vo)
    }

    public async getCommonGroupItemsListByPage(vo) {
        return await this.groupItemMapper.getCommonGroupItemsListByPage(vo)
    }

    public async getAllItemsTitleListByPage(vo) {
        //全量搜索所有常用账号组标题
        let allItemTitleList = await this.groupItemMapper.getAllItemsTitleList(true)
        let searchedList = []
        for (const item of allItemTitleList) {
            const decryptData = groupItemDecrypt(item.value)
            if (decryptData.includes(vo.value)) {
                searchedList.push(item)
            }
        }
        return {
            rows: searchedList.slice((vo.pageIndex - 1) * vo.pageSize, vo.pageSize),
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

    public async deleteGroupItemByItemId(itemId: string) {
        await this.groupItemMapper.deleteGroupItemByItemId(itemId)
    }

    public async deleteGroupItemByGroupId(id) {
        await this.groupItemMapper.deleteGroupItemByGroupId(id)
    }

    public async deleteItemById(id) {
        await this.groupItemMapper.deleteItemById(id)
    }

    public async setGroupItemCommon(itemId: string, isCommon: string) {
        await this.groupItemMapper.setGroupItemCommon(itemId, isCommon)
    }

}
