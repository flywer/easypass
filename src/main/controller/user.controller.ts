import {Controller, IpcHandle, Window} from "einf";
import {BrowserWindow} from "electron";
import {UserService} from "@main/service/user.service";
import {channel} from "@render/api/channel";
import {getDateString, getNetworkInfo, getUserAppDataFolder,} from "@common/utils/utils";
import {deleteFileFs, readFsSync, writeFs} from '@common/utils/fsUtils'
import {failure, success} from "@main/vo/resultVo";
import path from "path";
import {GroupService} from "@main/service/group.service";
import parseJson from 'parse-json'
import {GroupItemService} from "@main/service/groupItem.service";
import log from 'electron-log'
import {IUserVo} from "@main/model/user";

@Controller()
export class UserController {
    constructor(
        private userService: UserService,
        private groupService: GroupService,
        private groupItemService: GroupItemService,
        @Window() private readonly mainWindow: BrowserWindow // 主窗口实例
    ) {
    }

    /*用户本地信息文件*/
    private readonly userConfigFile = {
        folderPath: path.join(getUserAppDataFolder(), '/config'),
        fileName: 'userConfig.json',
        getFullPath: () => {
            return path.join(this.userConfigFile.folderPath, this.userConfigFile.fileName)
        }
    }

    /**
     * 检查Mac地址是否已注册
     * @constructor
     */
    @IpcHandle(channel.user.getUserByMac)
    public async HandleGetUserByMac() {
        let mac = getNetworkInfo().mac
        let result
        try {
            result = success()
            let res = await this.userService.getUserByMac(mac)
            if (res != null && res.length > 0) {
                result.result = res.at(0)
            } else {
                result.result = {
                    id: null,
                    mac: mac
                }
            }
        } catch (e) {
            log.error(e)
            result = failure()
        }
        return result
    }

    /**
     * 注册
     * @param user
     * @constructor
     */
    @IpcHandle(channel.user.register)
    public async HandleRegister(user) {
        user = user as IUserVo
        let result
        try {
            //获取本机mac地址
            user.mac = getNetworkInfo().mac
            /*//生成账号
            const idGenerate: SnowflakeIdGenerate = new SnowflakeIdGenerate();
            user.account = idGenerate.generate().toString()*/
            let res = await this.userService.register(user)
            await this.groupService.saveGroup({name: '默认', userId: res.id})
            result = success('注册成功！')
        } catch (e) {
            log.error(e)
            result = failure('注册失败！系统异常')
        }
        return result
    }

    /**
     * 登录
     * @param user
     * @constructor
     */
    @IpcHandle(channel.user.login)
    public async HandleLogin(user) {
        let result
        try {
            result = success()
            result.result = await this.userService.login(user, false)
            if (result.result == null) {
                result.tag = 1
                result.message = '账号密码不正确！'
            } else {
                const data = result.result
                data.lastLoginTime = getDateString()
                writeFs(this.userConfigFile, JSON.stringify(data))
                result.tag = 2
                result.message = '登录成功！'
            }
        } catch (e) {
            log.error(e)
            result = failure('系统异常')
        }
        return result
    }

    /**
     * 检查本地是否有账号,有则登录测试
     * @constructor
     */
    @IpcHandle(channel.user.checkLogin)
    public async HandleCheckLogin() {
        let result
        try {
            result = success()
            let buffer = await readFsSync(this.userConfigFile.getFullPath())
            if (buffer != null) {
                let userInfo = parseJson(buffer.toString())
                let res = await this.userService.login(userInfo, true)
                if (res == null) {
                    //本地用户信息错误
                    result.result = null
                } else {
                    res.lastLoginTime = getDateString()
                    result.result = res
                    writeFs(this.userConfigFile, JSON.stringify(res))
                }
            } else {
                //不存在本地记录
                result.result = null
            }
        } catch (e) {
            log.error(e)
            result = failure()
        }
        return result
    }

    /**
     * 退出
     * @constructor
     */
    @IpcHandle(channel.user.logout)
    public async HandleLogout() {
        let result
        try {
            result = success()
            //删除本地账号记录
            deleteFileFs(this.userConfigFile.getFullPath())
        } catch (e) {
            log.error(e)
            result = failure()
        }
        return result
    }

    /**
     * 账号注销
     * @param user
     * @constructor
     */
    @IpcHandle(channel.user.cancellation)
    public async HandleCancellation(user) {
        user = user as IUserVo
        let result
        try {
            //删除本地账号记录
            deleteFileFs(this.userConfigFile.getFullPath())
            //查询组信息
            const groupIdList = await this.groupService.getGroupIdByUserId(user.id)
            //删除账号组项
            await this.groupItemService.deleteGroupItemsByGroupId(groupIdList)
            //删除密码组
            await this.groupService.deleteGroupById(groupIdList)
            //删除账号
            await this.userService.deleteUserById(user.id)
            result = success('注销成功！')
        } catch (e) {
            log.error(e)
            result = failure('注销失败！服务器异常')
        }
        return result
    }

    /**
     * 通过用户ID更新用户信息
     * @param user
     * @constructor
     */
    @IpcHandle(channel.user.updateUserInfoByUserId)
    public async HandleUpdateUserInfoByUserId(user) {
        user = user as IUserVo
        let result
        try {
            if (user.id == null)
                result = failure('数据不全，更新失败')
            else {
                await this.userService.updateUserInfoByUserId(user)
                let userData = await this.userService.getUserById(user.id)
                //更新本地文件
                writeFs(this.userConfigFile, JSON.stringify(userData))
                result = success("更新成功！")
            }
        } catch (error) {
            log.error(error)
            result = failure("更新失败！")
        }
        return result
    }

    /**
     * 检查密码是否正确
     * @param user
     * @constructor
     */
    @IpcHandle(channel.user.checkPassword)
    public async HandleCheckPassword(user) {
        user = user as IUserVo
        let result
        try {
            let data = await this.userService.login(user, false)
            if (data == null) {
                result = failure()
            } else {
                result = success()
            }
        } catch (e) {
            log.error('检查密码是否正确失败', e)
            result = failure('检查密码是否正确失败')
        }
        return result
    }
}

