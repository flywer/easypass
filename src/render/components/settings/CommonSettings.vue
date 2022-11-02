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
          <a-button v-if="!hasUpdates" type="link" style="font-size: 12px" @click="onCheckForUpdate()">检查更新
          </a-button>
          <a-button v-if="hasUpdates" type="link" style="font-size: 12px" @click="onDownloadUpdates()">发现船新版本！立即下载
          </a-button>
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
</template>
<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {checkForUpdate, downloadUpdate, getAppSettings, getAppVersion, setAppSettings} from "@render/api/app.api";
import {store} from "@render/store";
import {message} from "ant-design-vue";
import {ipcInstance} from "@render/plugins";
import {channel} from "@render/api/channel";
import RowCard from "@render/components/settings/RowCard.vue";
import SecondaryText from "@render/components/settings/SecondaryText.vue";

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
/*已发现可更新版本*/
const hasUpdates = ref(false)
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

const onDownloadUpdates = async () => {
  /*下载更新*/
  store.isUpdating = true
  await downloadUpdate().catch(() => {
    message.error('系统异常')
  })
}

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
  hasUpdates.value = appSettings.hasUpdates
})

</script>
<style scoped lang="less">
@import "ant-design-vue/dist/antd.variable.less";

.app-version-div {
  background-color: #f5f5f5;
  padding: 0 14px;
}

</style>
