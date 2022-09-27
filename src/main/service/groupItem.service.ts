import {Injectable} from "einf";
import {groupItemMapper} from "@main/mapper/groupItem.mapper";
import {GroupItem} from "@main/model/groupItem";

@Injectable()
export class GroupItemService {
    constructor(private groupItemMapper: groupItemMapper) {
    }

    public saveGroupItems(groupItems: typeof GroupItem[]) {
        return this.groupItemMapper.saveGroupItems(groupItems)
    }
}
