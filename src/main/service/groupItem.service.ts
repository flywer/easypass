import {Injectable} from "einf";
import {groupItemMapper} from "@main/mapper/groupItem.mapper";
import {GroupItem} from "@main/model/groupItem";

@Injectable()
export class GroupItemService {
    constructor(private groupItemMapper: groupItemMapper) {
    }

    public saveGroupItem(groupItem: typeof GroupItem) {
        return this.groupItemMapper.saveGroupItem(groupItem)
    }
}
