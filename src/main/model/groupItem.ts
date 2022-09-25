import {BaseVo} from "@main/model/baseVo";

const {Sequelize, DataTypes, Model} = require('sequelize');
import {sequelize} from "@main/sequelize.init";

/**
 * 账号组项model：每个密码组有多个组项
 */
export class GroupItem extends Model {
    /*主键ID*/
    declare id: string;
    /*名称*/
    declare name: string;
    /*组项ID：相同组项ID代表为同一组*/
    declare itemId: string;
    /*组项是否是标题项*/
    declare isTitle: boolean;
    /*组项是否是主体账号*/
    declare isAccount: boolean;
    /*是否为密码，特殊处理*/
    declare isPassword: boolean;

    constructor(obj?: {
        id?: string,
        name: string
        itemId?: string,
        isTitle?: boolean,
        isAccount?: boolean,
        isPassword?: boolean
    }) {
        super();
        this.id = obj.id
        this.itemId = obj.itemId
        this.isTitle = obj.isTitle
        this.isAccount = obj.isAccount
        this.isPassword = obj.isPassword
    }
}

class GroupItemVo extends BaseVo {
    /*主键ID*/
    id: string;
    /*名称*/
    name: string;
    /*组项ID：相同组项ID代表为同一组*/
    itemId: string;
    /*组项是否是标题项*/
    isTitle: boolean;
    /*组项是否是主体账号*/
    isAccount: boolean;
    /*是否为密码，特殊处理*/
    isPassword: boolean;
}


/**
 * 初始化，注册为sequelize模型
 */
export const groupItemInit = () => {
    GroupItem.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            comment: '主键ID'
        },
        name: {
            type: DataTypes.STRING(24),
            notNull: true,
            unique: true,
            comment: '名称'
        },
        itemId: {
            type: DataTypes.UUID,
            comment: '组项ID：相同组项ID代表为同一组'
        },
        isTitle: {
            type: DataTypes.BOOLEAN,
            comment: '组项是否是标题项'
        },
        isAccount: {
            type: DataTypes.BOOLEAN,
            comment: '组项是否是主体账号'
        },
        isPassword: {
            type: DataTypes.BOOLEAN,
            comment: '是否为密码项'
        }
    }, {
        sequelize,
        tableName: 'group_item',
        comment: '账号组项表'
    });
}

