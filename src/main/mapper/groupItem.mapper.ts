import {Injectable} from "einf";
import {sequelize} from "@main/sequelize.init";
import {GroupItem} from "@main/model/groupItem";
import {uuid} from "vue3-uuid";

@Injectable()
export class groupItemMapper {
    constructor() {
    }

    public async saveGroupItems(groupItems: typeof GroupItem[]) {
        const res = await sequelize.transaction(() => {
            const itemId = uuid.v4
            for (let item in groupItems) {

            }
            return GroupItem.bulkCreate(groupItems)
        })
        console.log(res)
        return res
    }
}
