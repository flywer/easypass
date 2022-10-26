import {sequelize} from "@main/sequelize.init";
import {DataTypes} from "sequelize";

/**
 * 账号组项model：每个密码组有多个组项，每个组项若itemId相同代表为同一组（不是指密码组）
 */
export let GroupItem = sequelize.define('groupItem', {
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
        type: DataTypes.STRING(512),
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
    isCommon: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: '组项是否是常用账号'
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
    },
    isShow: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: '是否展示'
    },
    itemIndex: {
        type: DataTypes.INTEGER,
        defaultValue: 1000,
        comment: '排序号'
    },
    pwdGroupId: {
        type: DataTypes.STRING,
        defaultValue: false,
        comment: '所属密码组ID'
    }
}, {
    tableName: 'group_item',
    comment: '账号组项表'
})
