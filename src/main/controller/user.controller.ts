import {Controller, IpcHandle, Window} from "einf";
import {BrowserWindow} from "electron";
import {UserService} from "@main/service/user.service";
import {channel} from "@render/api/channel";
import {getNetworkInfo} from "@main/utils";
import {failure, success} from "@main/vo/resultVo";

@Controller()
export class UserController {
    constructor(
        private userService: UserService,
        @Window() private readonly mainWindow: BrowserWindow // 主窗口实例
    ) {
    }

    /**
     * 检查Mac地址是否已注册
     * @constructor
     */
    @IpcHandle(channel.user.getMacExist)
    public async HandleGetMacExist() {
        let mac = getNetworkInfo().mac
        let result
        try {
            result = success()
            let user = await this.userService.getUserByMac(mac)
            if (user != null) {
                result.result = {
                    id: user.at(0).dataValues.id,
                    mac: mac
                }
            } else {
                result.result = {
                    id: null,
                    mac: mac
                }
            }
        } catch (e) {
            console.error(e)
            result = failure()
        }
        return result
    }
}
