import {Injectable} from "einf";
import {groupItemMapper} from "@main/mapper/groupItem.mapper";
import {GroupItem} from "@main/model/groupItem";
import {uuid} from "vue3-uuid";

@Injectable()
export class GroupItemService {
    constructor(private groupItemMapper: groupItemMapper) {
    }

    public saveGroupItems(groupItems: typeof GroupItem[], groupId) {
        //相同账号组有同一个组ID
        const itemId = uuid.v4()
        groupItems.forEach((item) => {
            item.itemId = itemId
            item.PwdGroupId = groupId
        })
        return this.groupItemMapper.saveGroupItems(groupItems)
    }

    getGroupItemsList(vo) {
        return this.groupItemMapper.getGroupItemsList(vo)
    }
}
