import {app} from 'electron'
import {createEinf} from 'einf'
import {AppController} from './controller/app.controller'
import {createWindow} from './main.window'
import {sequelize} from "@main/mysql";
import {User} from "@main/model/user";
import {PwdGroup} from "@main/model/pwdGroup";

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

async function electronAppInit() {
    const isDev = !app.isPackaged
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin')
            app.exit()
    })

    if (isDev) {
        if (process.platform === 'win32') {
            process.on('message', (data) => {
                if (data === 'graceful-exit')
                    app.exit()
            })
        } else {
            process.on('SIGTERM', () => {
                app.exit()
            })
        }
    }
}

async function bootstrap() {
    try {
        await electronAppInit()

        await createEinf({
            window: createWindow,
            controllers: [AppController],
            injects: [{
                name: 'IS_DEV',
                inject: !app.isPackaged,
            }],
        })


        //验证是否连接成功
        sequelize.authenticate().then(async () => {
            console.log('数据库连接成功!');
            //将检查数据库中表的当前状态(它具有哪些列,它们的数据类型等),然后在表中进行必要的更改以使其与模型匹配
            //await sequelize.sync({force: true});
            //await PwdGroup.sync()

            const group = await PwdGroup.create({name:"默认"})
            
            //const user = await User.findAll()
            //console.log(user)
        }).catch(err => {
            console.error('数据库连接失败:', err);
        });

    } catch (error) {
        console.error(error)
        app.quit()
    }
}

bootstrap()
