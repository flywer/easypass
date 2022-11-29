<script setup lang="ts">
import {createVNode, h, onMounted, reactive, ref, watch} from 'vue'
import WindowBtn from '@render/components/base/WindowBtn.vue'
import LeftSiderMenu from '@render/components/base/LeftSiderMenu.vue'
import CenterContent from '@render/components/base/CenterContent.vue'
import {Button, ConfigProvider, message, Modal, notification} from 'ant-design-vue';
import {
  downloadUpdate,
  getAppSettings,
  getAppTheme, getTokenSettings,
  quitAndInstall, setLoginMode
} from "@render/api/app.api";
import {store} from "@render/store";
import {ipcInstance} from "@render/plugins";
import {channel} from "@render/api/channel";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
import config from "@common/config/appConfig.json"
import {checkLogin} from "@render/api/user.api";
import {cloneDeep, isNull, isUndefined} from "lodash-es";
import {Model} from "sequelize";
import {useRouter} from "vue-router";
import AppTokenValid from "@render/components/base/AppTokenValid.vue";

const router = useRouter()

//配置动态主题
const autoThemeConfig = async () => {
  await getAppTheme().then(res => {
    if (res.data.success) {
      store.theme = res.data.result
    } else {
      //异常
      message.info(res.data.message)
      store.theme = config.defaultTheme
    }
    ConfigProvider.config({
      theme: store.theme,
    });
  })
}

/*监听应用更新下载完毕回调*/
const updateDownloadedListener = () => {
  ipcInstance.on(channel.app.sendUpdateDownloaded, res => {
    store.isDownloaded = true
    Modal.confirm({
      title: '提示',
      icon: createVNode(ExclamationCircleOutlined),
      content: '下载完成，是否退出并安装？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        quitAndInstall()
      },
    });
  })
}

/*注册提醒*/
const notificationKey = `open${Date.now()}`;
const openUnLoginNotification = () => {
  notification.open({
    message: '提醒',
    description:
        '当前未登录，是否前往登录？',
    placement: "bottomRight",
    btn: () =>
        h(
            Button,
            {
              type: 'primary',
              size: 'small',
              onClick: () => {
                store.selectedMenuKeys = ['500']
                router.push({name: 'settings'})
                notification.close(notificationKey)
              },
            },
            {default: () => '登录'},
        ),
    key: notificationKey,
  });
};

onMounted(async () => {
  /*检查是否有已登录账号*/
  checkLogin().then(res => {
    if (res.data.result != null) {
      store.isLogin = true
      store.user = cloneDeep(res.data.result)
    } else {
      store.isLogin = false
      openUnLoginNotification()
    }
  })

  const appSettings = (await getAppSettings()).data.result
  if (typeof (appSettings.loginMode) == "undefined") { //默认跨平台模式
    await setLoginMode('02')
    store.loginMode = '02'
  } else {
    store.loginMode = appSettings.loginMode
  }
  await autoThemeConfig()
  updateDownloadedListener()
  autoCheckUpdates()
  await appTokenInit()
  antMessageInit()
})

/*应用令牌初始化*/
const appTokenInit = async () => {
  const tokenSettings = (await getTokenSettings()).data.result
  store.haveToken = tokenSettings.haveToken;
  store.showTokenPanel = tokenSettings.haveToken;
  store.tokenCheckRemainTimes = tokenSettings.remainTimes
  //界面隐藏时
  ipcInstance.on(channel.app.showTokenPanel, () => store.showTokenPanel = true)
}

/*令牌剩余输入次数检测*/
watch(() => store.tokenCheckRemainTimes, (value) => {
  if (value === 1) {
    Modal.confirm({
      title: '提示',
      icon: createVNode(ExclamationCircleOutlined),
      content: '还剩一次输入的机会，一旦错误将永久锁定！',
      okText: '确认',
      okCancel: false
    });
  }
})

const autoCheckUpdates = () => {
  const updateKey = 'updateKey'
  ipcInstance.on(channel.app.sendUpdateInfo, (res) => {
    switch (res.tag) {
        //检测更新时
      case 1:
        message.info({content: res.message, key: updateKey});
        break;
        //为最新版本时
      case 2:
        message.success({content: res.message, key: updateKey});
        store.hasUpdates = false
        break;
        //报错
      case 6:
        message.error({content: res.message, key: updateKey});
        break;
        //有可用更新
      case 3:
        store.hasUpdates = true
        Modal.confirm({
          title: '提示',
          icon: createVNode(ExclamationCircleOutlined),
          content: '发现更新的版本 ' + res.result.version + ' ，是否下载最新版本？',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            /*下载更新*/
            message.info('开始下载')
            store.isUpdating = true
            downloadUpdate().catch(() => {
              message.error('系统异常')
            })
          },
        });
    }
  })
}

/*全局消息弹窗全局设置*/
const antMessageInit = () => {
  message.config({
    top: '32px',
    maxCount: 4,
    duration:2
  })
}
</script>

<template>
  <a-config-provider>
    <WindowBtn/>
    <a-layout has-sider style="min-height: 100vh;">
      <AppTokenValid v-show="store.haveToken && store.showTokenPanel"/>
      <!-- 左菜单 -->
      <LeftSiderMenu v-show="!store.showTokenPanel"/>
      <!-- 中心内容组件载体 -->
      <CenterContent v-show="!store.showTokenPanel"/>
    </a-layout>
  </a-config-provider>
</template>

<style lang="less">
@import "ant-design-vue/dist/antd.variable.less";

//自定义滚动条 参考：https://blog.csdn.net/u012551928/article/details/109286853
::-webkit-scrollbar {
  width: 5px;
  height: 10px;
  border-radius: 10px;
  //background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  background-color: @primary-3;
  transition: 0.3s ease-in-out;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
  //-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #F5F5F5;
}
</style>
