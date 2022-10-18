<script setup lang="ts">
import {computed, createVNode, onMounted, reactive, ref, watch} from "vue";
import {
  checkForUpdate,
  downloadUpdate,
  getAppVersion,
  getOpenAtLogin,
  setAppTheme,
  setOpenAtLogin
} from "@render/api/app.api";
import {ConfigProvider, message, Modal, notification} from "ant-design-vue";
import {store} from "@render/store";
import {channel} from "@render/api/channel";
import {ipcInstance} from "@render/plugins";
import {cloneDeep, toNumber} from "lodash-es";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
import {CheckOutlined} from '@ant-design/icons-vue'

const tabActiveKey = ref('1')

/*开机自启动*/
const openAtLoginChecked = ref<boolean>(false);
/*设置开机自启*/
const setOpenAtLoginChecked = () => {
  setOpenAtLogin(openAtLoginChecked.value)
}

/*是否启用托盘图标*/
const checked2 = ref<boolean>(false);

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

onMounted(async () => {
  openAtLoginChecked.value = (await getOpenAtLogin()).data
  appVersion.value = (await getAppVersion()).data.result
  //接收下载信息
  ipcInstance.on(channel.app.sendDownloadProgress, (res) => {
    progressInfo.value = res.result
  })
})

/*验证token*/
const onValidToken = () => {
  message.info(';')
}

</script>

<template>
  <a-tabs v-model:activeKey="tabActiveKey" id="tabs-view" animated style="margin: 32px 8px 0 8px;">
    <a-tab-pane key="1" tab="用户设置">
      <a-layout-content class="setting-content">
        <a-row type="flex">
          <a-col flex="auto">
            <a-card class="card-view" :bordered="false" size="small"
                    style="height: 60px;line-height: 36px;padding: 0 12px;text-align: center">
              <a-layout-content>
                <div class="card-left-title">
                  Token
                  <a-button type="link" style="font-size: 10px">初次使用？点击生成</a-button>
                </div>
                <div style="float: right">
                  <a-input-group compact>
                    <a-input placeholder="Your Token" style="width: 360px" @keyup.enter="onValidToken"/>
                    <a-button @click="onValidToken">
                      <check-outlined/>
                    </a-button>
                  </a-input-group>
                </div>
              </a-layout-content>
            </a-card>
          </a-col>
        </a-row>

      </a-layout-content>
    </a-tab-pane>
    <a-tab-pane key="2" tab="界面设置">
      <a-layout-content class="setting-content">
        <!--主题色-->
        <a-row type="flex">
          <a-col flex="auto">
            <a-card class="card-view" :bordered="false" size="small"
                    style="height: 60px;line-height: 36px;padding: 0 12px;text-align: center">
              <a-layout-content>
                <div class="card-left-title">
                  主题色
                </div>
                <div style="float: right">
                  <input
                      type="color"
                      :value="colorState.primaryColor"
                      @input="onColorChange('primaryColor', $event)"
                      @blur="handleSaveTheme('primaryColor',$event)"
                      style="border: none;cursor: pointer"
                  />
                  <span style="color: var(--ant-primary-color)"/></div>
              </a-layout-content>
            </a-card>

          </a-col>
        </a-row>

      </a-layout-content>
    </a-tab-pane>
    <a-tab-pane key="3" tab="通用设置">
      <a-layout-content class="setting-content">
        <!--开机自启-->
        <a-row type="flex">
          <a-col flex="auto">
            <a-card class="card-view" :bordered="false" size="small"
                    style="height: 60px;line-height: 36px;padding: 0 12px;text-align: center">
              <a-layout-content>
                <div class="card-left-title">
                  开机自启动
                </div>
                <div style="float: right">
                  <a-switch v-model:checked="openAtLoginChecked" @click="setOpenAtLoginChecked"/>
                </div>
              </a-layout-content>
            </a-card>
          </a-col>
        </a-row>
        <!--启动时最小化到托盘-->
        <a-row type="flex">
          <a-col flex="auto">
            <a-card class="card-view" :bordered="false" size="small"
                    style="height: 60px;line-height: 36px;padding: 0 12px;text-align: center">
              <a-layout-content>
                <div class="card-left-title">
                  启动时最小化到托盘
                </div>
                <div style="float: right">
                  <a-switch v-model:checked="checked2"/>
                </div>
              </a-layout-content>
            </a-card>
          </a-col>
        </a-row>
        <!--启用托盘-->
        <a-row type="flex">
          <a-col flex="auto">
            <a-card class="card-view" :bordered="false" size="small"
                    style="height: 60px;line-height: 36px;padding: 0 12px;text-align: center">
              <a-layout-content>
                <div class="card-left-title">
                  启用托盘
                  <a-typography-text type="secondary" style="font-size: 12px;margin-left: 6px">禁用此选项后关闭主窗口将直接退出程序
                  </a-typography-text>
                </div>
                <div style="float: right">
                  <a-switch v-model:checked="checked2"/>
                </div>
              </a-layout-content>
            </a-card>

          </a-col>
        </a-row>
        <a-divider class="setting-divider"/>
        <!--检查更新-->
        <a-row type="flex">
          <a-col flex="auto">
            <a-card class="card-view" :bordered="false" size="small"
                    style="height: 60px;line-height: 36px;padding: 0 12px;text-align: center">
              <a-layout-content>
                <div class="card-left-title">
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
                </div>
                <div style="float: right">
                  <div class="app-version-div">{{ appVersion }}</div>
                </div>
              </a-layout-content>
            </a-card>
          </a-col>
        </a-row>
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

</style>
