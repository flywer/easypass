<script setup lang="ts">
import {computed, createVNode, onMounted, reactive, ref, watch} from "vue";
import {
  checkAppToken,
  checkForUpdate, getAppDataFolderSize, getAppFolderSize,
  getAppSettings, getAppTempDataFolderSize,
  getAppVersion,
  getTokenSettings,
  openAppDataFolder,
  openAppFolder,
  openAppTempDataFolder,
  setAppMinSizeLock,
  setAppSettings,
  setAppToken,
} from "@render/api/app.api";
import {store} from "@render/store";
import {message, Modal} from "ant-design-vue";
import {ipcInstance} from "@render/plugins";
import {channel} from "@render/api/channel";
import RowCard from "@render/components/settings/RowCard.vue";
import SecondaryText from "@render/components/settings/SecondaryText.vue";
import {
  DownOutlined,
  ExclamationCircleOutlined,
  UpOutlined,
  LoadingOutlined,
  CopyOutlined
} from '@ant-design/icons-vue'
import ProxyForm from "@render/components/settings/common/ProxyForm.vue";
import {Rule} from "ant-design-vue/es/form";
import {isEmpty} from "lodash-es";
import {byteConvert} from "@render/utils/byteConvert";
import {copyText} from "@render/utils/clipboard";

/*开机自启动*/
const openAtLoginChecked = ref<boolean>(false);
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

/*是否启用托盘*/
const onEnableTray = () => {
  if (!enableTrayChecked.value) {
    openAsHidden.checked = false
    closeAsHidden.checked = false
    openAsHidden.disabled = true
    closeAsHidden.disabled = true
  } else {
    openAsHidden.disabled = false
    closeAsHidden.disabled = false
  }
  onSetAppSettings()
}

//region 应用更新设置
/*当前版本号*/
const appVersion = ref()
/*下载进度条*/
let progressInfo = ref({
  total: 0,
  delta: 0,
  transferred: 0,
  /*下载百分比*/
  percent: 0,
  bytesPerSecond: 0
})
/*是否自动检查更新*/
const autoCheckUpdatesChecked = ref(false)

const updateText = computed(() => {
  if (store.hasUpdates)
    return '发现船新版本！立即下载'
  else
    return '检查更新'
})
const onCheckForUpdate = async () => {
  await checkForUpdate()
}

/*设置进度条百分比监听*/
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

/*应用设置*/
const onSetAppSettings = () => {
  setAppSettings({
    openAtLogin: openAtLoginChecked.value,/*开机自启动*/
    enableTray: enableTrayChecked.value,/*是否启用托盘图标*/
    openAsHidden: openAsHidden.checked,/*启动是否隐藏到托盘*/
    closeAsHidden: closeAsHidden.checked,/*关闭时是否隐藏到托盘*/
    autoCheckUpdates: autoCheckUpdatesChecked.value/*是否自动检查更新*/
  })
}

onMounted(async () => {
  const appSettings = (await getAppSettings()).data.result
  openAtLoginChecked.value = appSettings.openAtLogin
  openAsHidden.checked = appSettings.openAsHidden
  closeAsHidden.checked = appSettings.closeAsHidden
  enableTrayChecked.value = appSettings.enableTray
  autoCheckUpdatesChecked.value = appSettings.autoCheckUpdates
  store.hasUpdates = appSettings.hasUpdates
})

//region 网络代理
const proxyVisible = ref(false)

/*显示修改密码框*/
const onShowProxyModal = () => {
  proxyVisible.value = !proxyVisible.value
}
//endregion

//region 应用令牌

const validateToken = async (_rule: Rule, value: string) => {
  if (value !== appTokenRef.model.token) {
    return Promise.reject("两次令牌不同");
  } else {
    return Promise.resolve();
  }
};

const appTokenRef = reactive({
  isShowTokenForm: false,
  model: {
    token: '',
    checkToken: ''
  },
  rules: {
    token: [
      {required: true, message: '令牌不可为空'}
    ],
    checkToken: [
      {required: true, message: '不可为空'},
      {validator: validateToken, trigger: 'change'}
    ],
  }
})

/*存储应用令牌*/
const onAppTokenSubmit = () => {
  setAppToken(appTokenRef.model.token).then(res => {
    if (res.data.success) {
      message.success(res.data.message)
      store.haveToken = true
      appTokenRef.model = {
        token: '',
        checkToken: ''
      }
      appTokenRef.isShowTokenForm = false
    }
  })
}

const appTokenCancelRef = reactive({
  isShowValidTokenForm: false,/*显示原令牌验证框*/
  validModel: {
    token: ''
  }
})

const onTokenCancelValidToken = () => {
  if (!isEmpty(appTokenCancelRef.validModel.token))
    checkAppToken(appTokenCancelRef.validModel.token).then(res => {
      if (res.data.success) {
        store.tokenCheckRemainTimes = 5
        Modal.confirm({
          title: '提示',
          icon: createVNode(ExclamationCircleOutlined),
          content: '是否停止使用应用令牌？',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            setAppToken(null).then(res => {
              if (res.data.success) {
                message.success(res.data.message)
                store.haveToken = false
                store.showTokenPanel = false
                appTokenCancelRef.isShowValidTokenForm = false
              }
            })
          },
        });
      } else {
        message.warn(res.data.message)
        store.tokenCheckRemainTimes--
        appTokenCancelRef.isShowValidTokenForm = false
      }

    })
}

const appTokenUpdateRef = reactive({
  isShowValidTokenForm: false,/*显示原令牌验证框*/
  validModel: {
    token: ''
  },
})

const onTokenUpdateValidToken = () => {
  if (!isEmpty(appTokenUpdateRef.validModel.token))
    checkAppToken(appTokenUpdateRef.validModel.token).then(res => {
      if (res.data.success) {
        store.tokenCheckRemainTimes = 5
        appTokenUpdateRef.isShowValidTokenForm = false
        appTokenRef.isShowTokenForm = true
      } else {
        store.tokenCheckRemainTimes--
        message.warn(res.data.message)
        appTokenUpdateRef.isShowValidTokenForm = false
      }
    })
}

//endregion

//region 最小化时锁住应用
const appMinSizeLockRef = reactive({
  checked: false,
  disabled: true
})

onMounted(async () => {
  appMinSizeLockRef.disabled = !store.haveToken;
  const tokenSettings = (await getTokenSettings()).data.result
  if (typeof (tokenSettings.appMinSizeLock) != 'undefined')
    appMinSizeLockRef.checked = tokenSettings.appMinSizeLock
  else
    appMinSizeLockRef.checked = false
})

watch(() => store.haveToken, (value) => {
  appMinSizeLockRef.disabled = !value;
})

const onAppMinSizeLock = () => {
  setAppMinSizeLock(appMinSizeLockRef.checked).then(res => {
    if (!res.data.success) {
      message.error(res.data.message)
      appMinSizeLockRef.checked = !appMinSizeLockRef.checked
    }
  })
}

//endregion

//region 存储空间
const onOpenAppFolder = () => {
  openAppFolder()
}

const onOpenAppDataFolder = () => {
  openAppDataFolder()
}

const onOpenAppTempDataFolder = () => {
  openAppTempDataFolder()
}

const storageInfoRef = reactive({
  isShow: false,
  appFolderSize: '0',
  appDataFolderSize: '0',
  appTempDataFolderSize: '0',
  loading: {/*计算时加载动画*/
    appFolderSizeLoading: true,
    appDataFolderSizeLoading: true,
    appTempDataFolderSizeLoading: true
  }
})

const onShowStorageInfo = () => {
  storageInfoRef.isShow = !storageInfoRef.isShow
}

onMounted(() => {
  getAppFolderSize().then(res => {
    if (res.data.success)
      storageInfoRef.appFolderSize = byteConvert(res.data.result)
  }).then(() => {
    storageInfoRef.loading.appFolderSizeLoading = false
  })

  getAppDataFolderSize().then(res => {
    if (res.data.success)
      storageInfoRef.appDataFolderSize = byteConvert(res.data.result)
  }).then(() => {
    storageInfoRef.loading.appDataFolderSizeLoading = false
  })

  getAppTempDataFolderSize().then(res => {
    if (res.data.success)
      storageInfoRef.appTempDataFolderSize = byteConvert(res.data.result)
  }).then(() => {
    storageInfoRef.loading.appTempDataFolderSizeLoading = false
  })

})
//endregion
</script>

<template>
  <a-layout-content class="setting-content">
    <!--开机自启-->
    <RowCard>
      <template #left>开机自启动</template>
      <template #right>
        <a-switch v-model:checked="openAtLoginChecked" @click="onSetAppSettings"/>
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
        <a-switch v-model:checked="openAsHidden.checked" :disabled="openAsHidden.disabled"
                  @click="onSetAppSettings"/>
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
        <a-switch v-model:checked="closeAsHidden.checked" :disabled="closeAsHidden.disabled"
                  @click="onSetAppSettings"/>
      </template>
    </RowCard>
    <a-divider class="setting-divider"/>
    <!--应用令牌-->
    <RowCard>
      <template #left>
        应用令牌
        <SecondaryText>
          <template #text>
            每次进入应用时验证令牌
          </template>
        </SecondaryText>
      </template>
      <template #right>
        <div
            v-show="
            !appTokenRef.isShowTokenForm &&
            !appTokenCancelRef.isShowValidTokenForm &&
            !appTokenUpdateRef.isShowValidTokenForm "
            class="animate__animated animate__flipInX"
        >
          <a-button
              v-show="!store.haveToken"
              @click="appTokenRef.isShowTokenForm = true">设置
          </a-button>
          <a-space v-show="store.haveToken">
            <a-button type="link" style=" padding-right: 2px;padding-left: 2px;font-size: 13px;"
                      @click="appTokenCancelRef.isShowValidTokenForm = true">解除令牌
            </a-button>
            <a-button @click="appTokenUpdateRef.isShowValidTokenForm = true">修改</a-button>
          </a-space>
        </div>
        <!--设置令牌-->
        <a-form
            class="animate__animated animate__flipInX row-card-form"
            v-show="appTokenRef.isShowTokenForm"
            :model="appTokenRef.model"
            @finish="onAppTokenSubmit"
            style="height: 48px"
        >
          <a-input-group compact>
            <a-form-item name="token" :rules="appTokenRef.rules.token">
              <a-input-password placeholder="请输入登录令牌" style="width: 180px"
                                v-model:value.trim="appTokenRef.model.token"/>
            </a-form-item>
            <a-form-item name="checkToken" :rules="appTokenRef.rules.checkToken">
              <a-input-password placeholder="确认登录令牌" style="width: 180px"
                                v-model:value.trim="appTokenRef.model.checkToken"/>
            </a-form-item>
            <a-button v-show="!isEmpty(appTokenRef.model.token)" html-type="submit">确定</a-button>
            <a-button v-show="isEmpty(appTokenRef.model.token)" @click="appTokenRef.isShowTokenForm = false">取消
            </a-button>
          </a-input-group>
        </a-form>
        <!--解除令牌验证表单-->
        <a-form
            class="animate__animated animate__flipInX"
            v-show="appTokenCancelRef.isShowValidTokenForm"
            :model="appTokenCancelRef.validModel"
            @finish="onTokenCancelValidToken"
            style="height: 48px"
        >
          <a-input-group compact>
            <a-form-item name="token">
              <a-input-password placeholder="请输入登录令牌" style="width: 200px"
                                v-model:value.trim="appTokenCancelRef.validModel.token"/>
            </a-form-item>
            <a-button v-show="!isEmpty(appTokenCancelRef.validModel.token)" html-type="submit">确定</a-button>
            <a-button v-show="isEmpty(appTokenCancelRef.validModel.token)"
                      @click="appTokenCancelRef.isShowValidTokenForm = false">取消
            </a-button>
          </a-input-group>
        </a-form>
        <!--修改令牌验证表单-->
        <a-form
            class="animate__animated animate__flipInX"
            v-show="appTokenUpdateRef.isShowValidTokenForm"
            :model="appTokenUpdateRef.validModel"
            @finish="onTokenUpdateValidToken"
            style="height: 48px"
        >
          <a-input-group compact>
            <a-form-item name="token">
              <a-input-password placeholder="请输入登录令牌" style="width: 200px"
                                v-model:value.trim="appTokenUpdateRef.validModel.token"/>
            </a-form-item>
            <a-button v-show="!isEmpty(appTokenUpdateRef.validModel.token)" html-type="submit">确定</a-button>
            <a-button v-show="isEmpty(appTokenUpdateRef.validModel.token)"
                      @click="appTokenUpdateRef.isShowValidTokenForm = false">取消
            </a-button>
          </a-input-group>
        </a-form>
      </template>
    </RowCard>
    <!--最小化时锁住应用-->
    <RowCard>
      <template #left>最小化时锁住应用</template>
      <template #right>
        <a-switch v-model:checked="appMinSizeLockRef.checked" :disabled="appMinSizeLockRef.disabled"
                  @click="onAppMinSizeLock"/>
      </template>
    </RowCard>
    <a-divider class="setting-divider"/>
    <!--网络代理-->
    <RowCard :bottom-card-visible="proxyVisible">
      <template #left>
        <a-space style="gap:2px">
          网络代理
          <SecondaryText>
            <template #text>需重启应用更新全局网络代理</template>
          </SecondaryText>
        </a-space>
      </template>
      <template #right>
        <a-button v-if="!proxyVisible" class="animate__animated animate__flipInX"
                  @click="onShowProxyModal">
          <template #icon>
            <down-outlined/>
          </template>
          设置
        </a-button>
        <a-button v-if="proxyVisible"
                  class="animate__animated animate__flipInX"
                  @click="onShowProxyModal"
        >
          <template #icon>
            <up-outlined/>
          </template>
          取消
        </a-button>
      </template>
      <template #bottom-card>
        <ProxyForm/>
      </template>
    </RowCard>
    <a-divider class="setting-divider"/>
    <!--自动检查更新-->
    <RowCard>
      <template #left>自动检查更新</template>
      <template #right>
        <a-switch v-model:checked="autoCheckUpdatesChecked" @click="onSetAppSettings"/>
      </template>
    </RowCard>
    <!--检查更新-->
    <RowCard>
      <template #left>
        版本号
        <a-typography-text type="secondary" v-show="!store.isUpdating">
          <a-button type="link" style="font-size: 12px" @click="onCheckForUpdate()">{{ updateText }}</a-button>
        </a-typography-text>
        <a-progress
            v-show="store.isUpdating"
            type="circle"
            :width="50"
            :strokeWidth="10"
            :percent="parseInt(progressInfo.percent.toString())"
            class="update-progress"
            style="position: absolute;top: 9%;margin-left: 12px"
        />
      </template>
      <template #right>
        <div class="app-version-div">{{ appVersion }}</div>
      </template>
    </RowCard>
    <a-divider class="setting-divider"/>
    <!--应用情况-->
    <RowCard :bottom-card-visible="storageInfoRef.isShow">
      <template #left>存储空间
        <SecondaryText>
          <template #text>
            <span>应用资源占用空间：</span>
            <span v-if="!storageInfoRef.loading.appFolderSizeLoading">{{ storageInfoRef.appFolderSize }}</span>
            <span v-else><loading-outlined/></span>
          </template>
        </SecondaryText>
      </template>
      <template #right>

        <a-button @click="onOpenAppFolder">打开App文件夹</a-button>
        <a-button type="text" size="middle" class="tool-btn" style="margin-left: 4px" @click="onShowStorageInfo">
          <template #icon>
            <down-outlined :rotate="storageInfoRef.isShow?180:0"/>
          </template>
        </a-button>
      </template>
      <template #bottom-card>
        <a-row type="flex" align="middle">
          <a-col :flex="2">
            <span>AppData文件已占空间：</span>
            <span v-if="!storageInfoRef.loading.appDataFolderSizeLoading">{{ storageInfoRef.appDataFolderSize }}</span>
            <span v-else><loading-outlined/></span>
          </a-col>
          <a-col>
            <a-button @click="onOpenAppDataFolder">打开AppData文件夹</a-button>
          </a-col>
        </a-row>
        <a-row type="flex" align="middle" style="margin-top: 8px">
          <a-col :flex="2">
            <span>临时文件已占空间：</span>
            <span v-if="!storageInfoRef.loading.appTempDataFolderSizeLoading">
              {{ storageInfoRef.appTempDataFolderSize }}</span>
            <span v-else><loading-outlined/></span>
          </a-col>
          <a-col>
            <a-button @click="onOpenAppTempDataFolder">打开Temp文件夹</a-button>
          </a-col>
        </a-row>
      </template>
    </RowCard>
    <a-divider class="setting-divider"/>
    <!--BUG反馈-->
    <RowCard>
      <template #left>BUG反馈</template>
      <template #right>
        邮箱：<a href="mailto:1781998918@qq.com">1781998918@qq.com</a>
        <copy-outlined style="margin-left: 8px" @click="copyText('1781998918@qq.com',true)"/>
      </template>
    </RowCard>
  </a-layout-content>
</template>

<style scoped lang="less">
@import "ant-design-vue/dist/antd.variable.less";

.app-version-div {
  background-color: #f5f5f5;
  padding: 0 14px;
}

.tool-btn:hover {
  background-color: @primary-1;
}

:deep(.ant-form-item-explain-error) {
  font-size: 11px;
}
</style>
