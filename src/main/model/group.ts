import {sequelize} from "@main/sequelize.init";
import {DataTypes} from "sequelize";
import {IPageVo} from "@main/vo/pageVo";

export interface IGroupVo extends IPageVo {
    id?: string,
    name?: string,
    description?: string,
    groupIndex?: number,
    userId?: string
}

/**
 * 密码组信息model
 */
export let Group

export const groupInit = () => {
    Group = sequelize.define('group', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: '主键ID'
        },
        name: {
            type: DataTypes.STRING(36),
            comment: '组名'
        },
        description: {
            type: DataTypes.STRING(128),
            comment: '描述'
        },
        groupIndex: {
            type: DataTypes.INTEGER,
            defaultValue:0,
            comment: '排序号'
        },
        userId: {
            type: DataTypes.STRING,
            comment: '所属用户ID'
        }
    }, {
        tableName: 'group',
        comment: '密码组信息表'
    })
}
