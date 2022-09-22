import {Controller, IpcHandle, IpcSend, Window} from "einf";
import {AppService} from "@main/service/app.service";
import {BrowserWindow} from "electron";
import {toRaw} from "vue";
import {PwdMgtService} from "@main/service/pdwMgt.service";
import {Model} from "sequelize";

@Controller()
export class PwdMgtController {
    constructor(
        private pwdMgtService: PwdMgtService,
    ) {
    }


    /**
     * 通过用户信息获取密码分组信息
     * @param user
     */
    @IpcHandle('pwdMgt/getPwdGroupListByUserInfo')
    public async handleGetPwdGroupListByUserInfo(user: {}) {
        let resultArr = []
        resultArr =  await this.pwdMgtService.getPwdGroupListByUserInfo(user).then(res => {
            return res
        })
        return resultArr
    }

/*    @IpcSend('send:pwdMgt/getPwdGroupListByUserInfo')
    public  sendPwdGroupListByUserInfo(pwdGroupListByUserInfo) {
        return pwdGroupListByUserInfo;
    }*/

}
