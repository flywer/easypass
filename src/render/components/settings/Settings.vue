<script setup lang="ts">
import {createVNode, onMounted, reactive, ref, watch} from "vue";
import {
  checkForUpdate,
  downloadUpdate, getAppSettings,
  getAppVersion,
  getOpenAtLogin,
  setAppTheme, setCloseAsHidden, setEnableTray,
  setOpenAtLogin
} from "@render/api/app.api";
import {ConfigProvider, message, Modal, notification} from "ant-design-vue";
import {store} from "@render/store";
import {channel} from "@render/api/channel";
import {ipcInstance} from "@render/plugins";
import {cloneDeep, isEmpty, random, toNumber} from "lodash-es";
import {
  ExclamationCircleOutlined,
  SwapOutlined,
  CheckOutlined,
  EditOutlined,
  CopyOutlined
} from "@ant-design/icons-vue";
import RowCard from "@render/components/settings/RowCard.vue";
import {
  cancellation,
  checkPassword,
  getUserByMac,
  login,
  logout,
  register,
  updateUserInfoByUserId
} from "@render/api/user.api";
import {useRouter} from "vue-router";
import SecondaryText from "@render/components/settings/SecondaryText.vue";
import * as Assert from "assert";
import {copyText} from "@render/utils/clipboard";

const tabActiveKey = ref('1')

//region 开机自启动
/*开机自启动*/
const openAtLoginChecked = ref<boolean>(false);

//endregion

//region 托盘
/*是否启用托盘图标*/
const enableTrayChecked = ref<boolean>(true);
/*启动时最小化到托盘*/
const openAsHidden = reactive({
  checked: false,
  disabled: false
});
/*关闭时隐藏到托盘*/
const closeAsHidden = reactive({
  checked: false,
  disabled: false
});

/*开机设置， 包括自启和是否隐藏到托盘*/
const onOpenAtLogin = () => {
  setOpenAtLogin({openAtLogin: openAtLoginChecked.value, openAsHidden: openAsHidden.checked})
}

/*是否启用托盘*/
const onEnableTray = () => {
  setEnableTray(enableTrayChecked.value)
  if (enableTrayChecked.value) {
    openAsHidden.checked = false
    openAsHidden.disabled = true
    closeAsHidden.checked = false
    closeAsHidden.disabled = true
  } else {
    openAsHidden.disabled = false
    closeAsHidden.disabled = false
  }
  onOpenAtLogin()
  onCloseAsHidden()
}

/*关闭时是否隐藏到托盘*/
const onCloseAsHidden = () => {
  setCloseAsHidden(closeAsHidden.checked)
}

onMounted(async () => {
  const appSettings = (await getAppSettings()).data.result
  openAtLoginChecked.value = appSettings.openAtLogin
  openAsHidden.checked = appSettings.openAsHidden
  closeAsHidden.checked = appSettings.closeAsHidden
})

//endregion

//region 应用更新设置
/*当前版本号*/
const appVersion = ref()
const updateKey = 'updateKey'
let progressInfo = ref({
  total: 0,
  delta: 0,
  transferred: 0,
  /*下载百分比*/
  percent: 0,
  bytesPerSecond: 0
})
const onCheckForUpdate = async () => {
  ipcInstance.on(channel.app.sendUpdateInfo, (res) => {
    switch (res.tag) {
        //检测更新、为最新版本、报错
      case 1 || 2 || 6:
        if (res.success)
          message.info({content: res.message, key: updateKey});
        else
          message.error({content: res.message, key: updateKey});
        break;
        //有可用更新
      case 3:
        Modal.confirm({
          title: '提示',
          icon: createVNode(ExclamationCircleOutlined),
          content: '发现更新的版本 ' + res.result.version + ' ，是否下载最新版本？',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            onDownloadUpdate()
          },
        });
    }
  })
  await checkForUpdate()
}
/*下载更新*/
const onDownloadUpdate = async () => {
  store.isUpdating = true
  await downloadUpdate().catch(() => {
    message.error('系统异常')
  })
}
/*设置进度条百分比*/
watch(() => store.isDownloaded, () => {
  //已下载完毕或者已有安装包
  if (store.isDownloaded) {
    progressInfo.value.percent = 100
  }
})

onMounted(async () => {
  appVersion.value = (await getAppVersion()).data.result
  //接收下载信息
  ipcInstance.on(channel.app.sendDownloadProgress, (res) => {
    progressInfo.value = res.result
  })
})

//endregion

//region 主题色
/*主题色*/
const colorState = reactive(store.theme);
/*改变主题色*/
const onColorChange = (type: string, e: any) => {
  Object.assign(colorState, {[type]: e.target.value});
  ConfigProvider.config({
    theme: colorState,
  });
};
/*保存主题色*/
const handleSaveTheme = async (type: string, e: any) => {
  Object.assign(colorState, {[type]: e.target.value});
  ConfigProvider.config({
    theme: colorState,
  });
  await setAppTheme(JSON.stringify(colorState))
}

//endregion

//region 用户登录、注册
const loginCardRef = reactive({
  activeSpinning: false,
  isLoginCard: true,/*当前是否为登录框*/
  loginText: '登录',
  registerText: '注册',
  titleText: '登录',
  swapText: '注册',
  loginModel: {
    account: '',
    password: ''
  },
  registerModel: {
    name: '',
    account: '',
    password: ''
  }
})

const formRules = reactive({
  account: [{required: true, message: '用户名不可为空'}, {min: 6, max: 24, message: '用户名长度在6-24之间'}],
  password: [{required: true, message: '密码不可为空'}, {min: 6, max: 24, message: '用户名长度在6-24之间'}]
})

/*注册*/
const onRegister = async () => {
  loginCardRef.activeSpinning = true

  //设置初始昵称
  if (isEmpty(loginCardRef.registerModel.name))
    loginCardRef.registerModel.name = '小白' + random(100000, 999999)
  register({
    account: loginCardRef.registerModel.account,
    name: loginCardRef.registerModel.name,
    mode: '02',
    password: loginCardRef.registerModel.password
  }).then(async res => {
    if (res.data.success) {
      message.success(res.data.message)
      //登录
      let result = await login({
        account: loginCardRef.registerModel.account,
        password: loginCardRef.registerModel.password
      })
      if (result.data.tag == 2) {
        store.isLogin = true
        store.user = cloneDeep(result.data.result.dataValues)
      } else {
        message.warn(result.data.message)
      }
    } else message.warn(res.data.message)

    //初始化
    loginCardRef.registerModel = {
      name: '',
      account: '',
      password: ''
    }
    loginCardRef.activeSpinning = false
  }).catch(e => {
    console.error(e)
  })
}

/*登录*/
const onLogin = async () => {
  loginCardRef.activeSpinning = true

  let result = await login({account: loginCardRef.loginModel.account, password: loginCardRef.loginModel.password})
  if (result.data.tag == 2) {
    message.success(result.data.message)
    store.isLogin = true
    store.user = cloneDeep(result.data.result.dataValues)
    store.user.mode = '02'
  } else {
    message.warn(result.data.message)
  }
  loginCardRef.activeSpinning = false
}

/*登录注册框切换*/
const swapCard = () => {
  loginCardRef.isLoginCard = !loginCardRef.isLoginCard
  loginCardRef.swapText = loginCardRef.isLoginCard ? '注册' : '登录'
  loginCardRef.titleText = loginCardRef.isLoginCard ? '登录' : '注册'
}

//endregion

//region 用户退出
/*退出*/
const onLogout = async () => {
  store.isLogin = false
  store.user = {
    id: null,
    mode: '02'
  }
  loginCardRef.loginModel.account = ''
  loginCardRef.loginModel.password = ''
  await logout()
}

//endregion

//region 用户信息
const userInfoRef = reactive({
  isEdit: false,
  name: store.user.name,
  account: store.user.account,
  model: {
    name: ''
  }
})

watch(() => store.user.name, (value) => {
  userInfoRef.name = value
})

/*是否更改用户名*/
const onEditUserName = () => {
  userInfoRef.isEdit = !userInfoRef.isEdit
  userInfoRef.model.name = store.user.name
}

/*更新用户名*/
const onUpdateUserName = () => {
  if (isEmpty(userInfoRef.model.name)) {
    message.error('名称不可为空！')
    return null
  } else if (isEmpty(store.user.id)) {
    message.error('登录异常，请重启应用尝试解决')
    return null
  } else {
    updateUserInfoByUserId({name: userInfoRef.model.name, id: store.user.id}).then(res => {
      if (res.data.success) {
        message.success(res.data.message)
        userInfoRef.isEdit = false
        store.user.name = userInfoRef.model.name
        userInfoRef.model.name = ''
      } else
        message.warn(res.data.message)
    })
  }
}
//endregion

//region 用户注销

let cancelCardRef = reactive({
  isConfirm: false,
  cancelFormBtnText: '取消',
  canReturn: true,/*点击取消返回*/
  model: {
    password: ''
  }
})

watch(() => cancelCardRef.model.password, (value) => {
  if (isEmpty(value)) {
    cancelCardRef.canReturn = true
    cancelCardRef.cancelFormBtnText = '取消'
  } else {
    cancelCardRef.canReturn = false
    cancelCardRef.cancelFormBtnText = '确认'
  }
})

const onCancelCardSwap = () => {
  cancelCardRef.isConfirm = true
}

/*注销*/
const onAccountCancellation = () => {
  if (cancelCardRef.canReturn) {
    cancelCardRef.isConfirm = false
  } else {
    checkPassword({account: store.user.account, password: cancelCardRef.model.password}).then(res => {
          if (res.data.success) {
            cancellation(store.user).then(res => {
              if (res.data.success) {
                message.success(res.data.message)
                store.isLogin = false
                store.user = {
                  id: null,
                  mode: '02'
                }
              } else {
                message.warn(res.data.message)
              }
            })
          } else {
            message.warn('密码错误！')
          }

          cancelCardRef.isConfirm = false
          cancelCardRef.model.password = ''
        }
    )
  }
}
//endregion

</script>

<template>
  <a-tabs v-model:activeKey="tabActiveKey" id="tabs-view" animated style="margin: 32px 8px 0 8px;">
    <a-tab-pane key="1" tab="用户设置">
      <a-layout-content class="setting-content">
        <!--账号模式-->
        <RowCard>
          <template #left>账号模式
            <a-typography-text type="secondary" style="font-size: 12px;margin-left: 6px">目前只可跨平台使用公共服务器
            </a-typography-text>
          </template>
          <template #right>
            <a-radio-group v-model:value="store.user.mode" button-style="solid">
              <a-radio-button value="01" disabled="true">
                <a-tooltip>
                  <template #title>其他设备访问时禁止</template>
                  本地
                </a-tooltip>
              </a-radio-button>
              <a-radio-button value="02">
                <a-tooltip>
                  <template #title>账号可在其他设备登录</template>
                  跨平台
                </a-tooltip>
              </a-radio-button>
            </a-radio-group>
          </template>
        </RowCard>
        <!--用户登录-->
        <RowCard v-if="!store.isLogin" class="user-login-card">
          <template #left>用户{{ loginCardRef.titleText }}</template>
          <template #right>
            <a-space>
              <a-space>
                <a-button type="link" class="swap-btn" @click="swapCard" :disabled="loginCardRef.activeSpinning">
                  <swap-outlined/>
                  <span style="margin-left: 1px">{{ loginCardRef.swapText }}</span>
                </a-button>
              </a-space>
              <div>
                <!--登录-->
                <a-form class="animate__animated animate__flipInX" v-show="loginCardRef.isLoginCard">
                  <a-input-group compact>
                    <a-form-item>
                      <a-input placeholder="用户名" style="width: 200px" maxlength="24"
                               v-model:value="loginCardRef.loginModel.account"/>
                    </a-form-item>
                    <a-form-item>
                      <a-input-password placeholder="密码" style="width: 200px" maxlength="24"
                                        v-model:value.trim="loginCardRef.loginModel.password"/>
                      <a-button :loading="loginCardRef.activeSpinning" @click="onLogin"
                                :disabled="loginCardRef.loginModel.password==='' || loginCardRef.loginModel.account === ''">
                        {{ loginCardRef.loginText }}
                      </a-button>
                    </a-form-item>
                  </a-input-group>
                </a-form>
                <!--注册-->
                <a-form
                    class="animate__animated animate__flipInX"
                    v-show="!loginCardRef.isLoginCard"
                    :model="loginCardRef.registerModel"
                    @finish="onRegister"
                >
                  <a-input-group compact>
                    <a-form-item name="account" :rules="formRules.account">
                      <a-input placeholder="取个好记的账号吧" style="width: 200px"
                               v-model:value="loginCardRef.registerModel.account"/>
                    </a-form-item>
                    <a-form-item name="password" :rules="formRules.password">
                      <a-input-password placeholder="想个复杂的密码吧" style="width: 200px"
                                        v-model:value.trim="loginCardRef.registerModel.password"/>
                      <a-button html-type="submit" :loading="loginCardRef.activeSpinning"
                                :disabled="loginCardRef.registerModel.password===''">
                        {{ loginCardRef.registerText }}
                      </a-button>
                    </a-form-item>
                  </a-input-group>
                </a-form>
              </div>
            </a-space>
          </template>
        </RowCard>
        <!--用户信息-->
        <RowCard v-if="store.isLogin">
          <template #left>
            <a-space style="gap:2px">
              <span>账号:</span>
              <span>{{ store.user.account }}</span>
              <copy-outlined style="margin-left: 4px" @click="copyText(userInfoRef.account,true)"/>
              <span style="border-left: 1px solid rgb(191 191 191);margin: 0 12px 0 12px"/>
              <span>用户名：</span>
              <span v-show="!userInfoRef.isEdit" style="max-width: 200px">{{ userInfoRef.name }}</span>
              <a-input v-show="userInfoRef.isEdit" :bordered="true" maxlength="12" style="max-width: 200px"
                       v-model:value="userInfoRef.model.name" @keyup.enter="onUpdateUserName"></a-input>
              <a-button v-show="!userInfoRef.isEdit" type="text" @click="onEditUserName">
                <edit-outlined/>
              </a-button>
              <a-button v-show="userInfoRef.isEdit" type="text" @click="onUpdateUserName">
                <check-outlined/>
              </a-button>
            </a-space>
          </template>
          <template #right>
            <a-button @click="onLogout">退出</a-button>
          </template>
        </RowCard>
        <!--账号注销-->
        <RowCard v-if="store.isLogin">
          <template #left>
            <a-space style="gap:2px">
              账号注销
              <SecondaryText>
                <template #text>将永久删除公共服务器中账号数据</template>
              </SecondaryText>
            </a-space>
          </template>
          <template #right>
            <a-button v-show="!cancelCardRef.isConfirm" class="animate__animated animate__flipInX" danger
                      @click="onCancelCardSwap">注销
            </a-button>
            <a-input-group v-show="cancelCardRef.isConfirm" compact class="animate__animated animate__flipInX">
              <a-input-password placeholder="请输入密码" style="width: 200px" @keyup.enter="onAccountCancellation"
                                v-model:value="cancelCardRef.model.password"/>
              <a-button @click="onAccountCancellation">{{ cancelCardRef.cancelFormBtnText }}</a-button>
            </a-input-group>
          </template>
        </RowCard>
      </a-layout-content>
    </a-tab-pane>
    <a-tab-pane key="2" tab="界面设置">
      <a-layout-content class="setting-content">
        <!--主题色-->
        <RowCard>
          <template #left>主题色</template>
          <template #right>
            <input
                type="color"
                :value="colorState.primaryColor"
                @input="onColorChange('primaryColor', $event)"
                @blur="handleSaveTheme('primaryColor',$event)"
                style="border: none;cursor: pointer"
            />
            <span style="color: var(--ant-primary-color)"/>
          </template>
        </RowCard>
      </a-layout-content>
    </a-tab-pane>
    <a-tab-pane key="3" tab="通用设置">
      <a-layout-content class="setting-content">
        <!--开机自启-->
        <RowCard>
          <template #left>开机自启动</template>
          <template #right>
            <a-switch v-model:checked="openAtLoginChecked"/>
          </template>
        </RowCard>
        <!--启用托盘-->
        <RowCard>
          <template #left>
            启用托盘
          </template>
          <template #right>
            <a-switch v-model:checked="enableTrayChecked" @click="onEnableTray"/>
          </template>
        </RowCard>
        <!--启动时最小化到托盘-->
        <RowCard>
          <template #left>启动时最小化到托盘</template>
          <template #right>
            <a-switch v-model:checked="openAsHidden.checked" :disabled="openAsHidden.disabled" @click="onOpenAtLogin"/>
          </template>
        </RowCard>
        <!--关闭到托盘-->
        <RowCard>
          <template #left>
            关闭时隐藏到托盘
            <SecondaryText>
              <template #text>禁用此选项后时关闭主窗口将直接退出程序</template>
            </SecondaryText>
          </template>
          <template #right>
            <a-switch v-model:checked="closeAsHidden.checked" :disabled="closeAsHidden.disabled" @click="onCloseAsHidden"/>
          </template>
        </RowCard>

        <a-divider class="setting-divider"/>

        <!--检查更新-->
        <RowCard>
          <template #left>
            版本号
            <a-typography-text type="secondary" v-show="!store.isUpdating">
              <a-button type="link" style="font-size: 12px" @click="onCheckForUpdate()">检查更新</a-button>
            </a-typography-text>
            <a-progress v-show="store.isUpdating"
                        type="circle"
                        :width="50"
                        :strokeWidth="10"
                        :percent="parseInt(progressInfo.percent.toString())"
                        class="update-progress"
            />
          </template>
          <template #right>
            <div class="app-version-div">{{ appVersion }}</div>
          </template>
        </RowCard>
      </a-layout-content>
    </a-tab-pane>
  </a-tabs>
</template>

<style scoped lang="less">
#tabs-view {
  :deep(.ant-tabs-nav) {
    margin-bottom: 2px;
  }
}

.setting-content {
  padding: 10px;

  .card-view {
    box-shadow: 0 1px 2px -2px rgb(0 0 0 / 16%),
    0 3px 6px 0 rgb(0 0 0 / 12%),
    0 5px 12px 4px rgb(0 0 0 / 9%);
    border-radius: 5px;
    margin-bottom: 12px;

    .card-left-title {
      float: left;
      -webkit-user-select: none; /*不可选*/
    }

    .update-progress {
      float: left;
      position: absolute;
      bottom: 7%;
      margin-left: 12px
    }
  }

  :deep(.ant-divider) {
    height: 2px;
    background-color: rgb(231 231 231 / 82%);
    margin: 4px 0 12px 0;
    padding: 0 2px
  }
}

@import "ant-design-vue/dist/antd.variable.less";

.app-version-div {
  background-color: #f5f5f5;
  padding: 0 14px;
}

.swap-btn {
  padding-right: 2px;
  margin-bottom: 20px;
  padding-left: 2px;
  font-size: 13px;
}

.user-login-card {
  :deep(.ant-form-item-explain-error) {
    font-size: 11px;
  }
}
</style>
