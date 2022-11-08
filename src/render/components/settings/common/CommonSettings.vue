<script setup lang="ts">
import {computed, createVNode, onMounted, reactive, ref, watch} from "vue";
import {
  checkAppToken,
  checkForUpdate,
  getAppSettings,
  getAppVersion,
  quitAndInstall,
  setAppSettings,
  setAppToken
} from "@render/api/app.api";
import {store} from "@render/store";
import {message, Modal} from "ant-design-vue";
import {ipcInstance} from "@render/plugins";
import {channel} from "@render/api/channel";
import RowCard from "@render/components/settings/RowCard.vue";
import SecondaryText from "@render/components/settings/SecondaryText.vue";
import {
  DownOutlined, ExclamationCircleOutlined,
  UpOutlined
} from '@ant-design/icons-vue'
import ProxyForm from "@render/components/settings/common/ProxyForm.vue";
import {Rule} from "ant-design-vue/es/form";
import {cloneDeep, isEmpty, isEqual, random} from "lodash-es";

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
const setProxyVisible = ref(false)

/*显示修改密码框*/
const onShowProxyModal = () => {
  setProxyVisible.value = !setProxyVisible.value
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
        appTokenRef.isShowTokenForm =true
      } else {
        store.tokenCheckRemainTimes--
        message.warn(res.data.message)
        appTokenUpdateRef.isShowValidTokenForm = false
      }
    })
}

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
            class="animate__animated animate__flipInX">
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
            class="animate__animated animate__flipInX"
            v-show="appTokenRef.isShowTokenForm"
            :model="appTokenRef.model"
            @finish="onAppTokenSubmit"
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
    <!--网络代理-->
    <RowCard :bottom-card-visible="setProxyVisible">
      <template #left>
        <a-space style="gap:2px">
          网络代理
          <SecondaryText>
            <template #text>需重启应用更新全局网络代理</template>
          </SecondaryText>
        </a-space>
      </template>
      <template #right>
        <a-button v-if="!setProxyVisible" class="animate__animated animate__flipInX"
                  @click="onShowProxyModal">
          <template #icon>
            <down-outlined/>
          </template>
          设置
        </a-button>
        <a-button v-if="setProxyVisible"
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
  </a-layout-content>
</template>


<style scoped lang="less">
@import "ant-design-vue/dist/antd.variable.less";

.app-version-div {
  background-color: #f5f5f5;
  padding: 0 14px;
}

</style>
