const {Sequelize, DataTypes, Model} = require('sequelize');
import {sequelize} from "@main/sequelize.init";

/**
 * 账号组项model：每个密码组有多个组项
 */
export class GroupItem extends Model {
    /*主键ID*/
    declare id: string;
    /*名称*/
    declare title: string;

    constructor(obj?: {
        id?: string,
        title: string
    }) {
        super();
        this.id = obj.id
        this.title = obj.title
    }
}

/**
 * 初始化，注册为sequelize模型
 */
export const groupItemInit = () => {
    GroupItem.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: '主键ID'
        },
        title: {
            type: DataTypes.STRING(24),
            notNull: true,
            unique: true,
            comment: '名称'
        },
    }, {
        sequelize,
        tableName: 'group_item',
        comment: '账号组项表'
    });
}

