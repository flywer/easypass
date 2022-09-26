import {Injectable} from "einf";
import {sequelize} from "@main/sequelize.init";
import {GroupItem} from "@main/model/groupItem";

@Injectable()
export class groupItemMapper {
    constructor() {
    }

    public async saveGroupItem(groupItem: typeof GroupItem) {
        const res = await sequelize.transaction(() => {
            return GroupItem.create(groupItem)
        })
        console.log(res)
        return res
    }
}
