import {Injectable} from "einf";
import {sequelize} from "@main/sequelize.init";
import {GroupItem} from "@main/model/groupItem";
import {Op} from "sequelize";
import {sqlLikePack} from "@main/utils";

@Injectable()
export class groupItemMapper {
    constructor() {
    }

    public async saveGroupItems(groupItems: typeof GroupItem[]) {
        return await sequelize.transaction(() => {
            return GroupItem.bulkCreate(groupItems)
        })
    }

    public async getGroupItemsList(vo) {
        console.log(vo)
        const {count, rows} = await GroupItem.findAndCountAll({
            attributes: ['itemId', 'value'],
            where: {
                [Op.and]: {
                    value: {
                        [Op.like]: sqlLikePack(vo.value, true, true)
                    },
                    PwdGroupId: vo.groupId,
                    isTitle: 1
                }
            },
            offset: (vo.pageIndex - 1) * vo.pageSize,
            limit: vo.pageSize
        })
        return {rows, count}
    }
}
