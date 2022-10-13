import {Injectable} from "einf";
import {groupItemMapper} from "@main/mapper/groupItem.mapper";
import {GroupItem} from "@main/model/groupItem";
import {uuid} from "vue3-uuid";

@Injectable()
export class GroupItemService {
    constructor(private groupItemMapper: groupItemMapper) {
    }

    public saveGroupItems(groupItems: typeof GroupItem[], groupId: string, isUpdate: boolean) {
        //相同账号组有同一个组ID
        let itemId
        if (isUpdate)
            itemId = groupItems.filter(item => item.isTitle == true).at(0).itemId
        else
            itemId = uuid.v4()
        groupItems.forEach((item) => {
            item.itemId = itemId
            item.pwdGroupId = groupId
        })
        return this.groupItemMapper.saveOrUpdateGroupItems(groupItems)
    }

    public getItemsTitleList(vo) {
        return this.groupItemMapper.getItemsTitleList(vo)
    }

    public async getItemsIdListByPage(vo) {
        return await this.groupItemMapper.getItemsIdListByPage(vo)
    }

    public async getItemsListByItemId(itemId: string) {
        return await this.groupItemMapper.getItemsListByItemId(itemId)
    }

    public async deleteGroupItemByItemId(itemId: string) {
        await this.groupItemMapper.deleteGroupItemByItemId(itemId)
    }

    public async deleteGroupItemByGroupId(id: string) {
        await this.groupItemMapper.deleteGroupItemByGroupId(id)
    }

    public async deleteItemById(id) {
        await this.groupItemMapper.deleteItemById(id)
    }
}
