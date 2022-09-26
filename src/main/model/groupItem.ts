import {sequelize} from "@main/sequelize.init";
import {DataTypes} from "sequelize";
import {BaseVo} from "@main/model/baseVo";

/**
 * 账号组项model：每个密码组有多个组项，每个组项若itemId相同代表为同一组（不是指密码组）
 */
export const GroupItem = sequelize.define('groupItem', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: '主键ID'
    },
    name: {
        type: DataTypes.STRING(24),
        notNull: true,
        comment: '名称'
    },
    value: {
        type: DataTypes.STRING(256),
        notNull: true,
        comment: '组项对应值'
    },
    itemId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        comment: '组项ID：相同组项ID代表为同一组'
    },
    isTitle: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: '组项是否是标题项'
    },
    isAccount: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: '组项是否是主体账号'
    },
    isPassword: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: '是否为密码项'
    }
}, {
    tableName: 'group_item',
    comment: '账号组项表'
})
