import {sequelize} from "@main/sequelize.init";
import {DataTypes} from "sequelize";
import {BaseVo} from "@main/model/baseVo";

/**
 * 密码组信息model
 */
export const PwdGroup = sequelize.define('group', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        comment: '主键ID',
    },
    name: {
        type: DataTypes.STRING(36),
        comment: '组名'
    },
    groupIndex: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        comment: '排序号'
    }
}, {
    tableName: 'pwd_group',
    comment: '密码组信息表'
})

export class PwdGroupVo extends BaseVo {
    id: string
    name: string
    groupIndex: number
    userId: string
}
