<script setup lang="ts">
import {createVNode, onMounted, ref} from 'vue'
import WindowBtn from '@render/components/base/WindowBtn.vue'
import LeftSiderMenu from '@render/components/base/LeftSiderMenu.vue'
import CenterContent from '@render/components/base/CenterContent.vue'
import {ConfigProvider, message, Modal} from 'ant-design-vue';
import {getAppTheme, getNetworkInterfaces, quitAndInstall} from "@render/api/app.api";
import {store} from "@render/store";
import {ipcInstance} from "@render/plugins";
import {channel} from "@render/api/channel";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
import config from "@common/config/config.json"
import {getMacExist} from "@render/api/user.api";

const manuKey = ref('')

// 接收子组件传过来的值，此为响应函数
const getMenuKey = (value) => {
  manuKey.value = value
}

onMounted(async () => {
  /*接收主题更新*/
  ipcInstance.on(channel.app.sendDefaultTheme, () => {
    autoThemeConfig()
  })

  ipcInstance.on(channel.app.sendUpdateDownloaded, res => {
    store.isDownloaded = true
    Modal.confirm({
      title: '提示',
      icon: createVNode(ExclamationCircleOutlined),
      content: '是否退出并安装？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        quitAndInstall()
      },
    });
  })

  /*接收网络接口信息*/
  ipcInstance.on(channel.app.sendNetworkInfo, res => {
    store.mac = res.mac
  })
})

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

</script>

<template>
  <a-config-provider>
    <WindowBtn/>
    <a-layout has-sider style="min-height: 100vh;">
      <!-- 左菜单 -->
      <LeftSiderMenu @getKey="getMenuKey"/>
      <!-- 中心内容组件载体 -->
      <CenterContent :menu-key="manuKey"/>
    </a-layout>
  </a-config-provider>
</template>

<style lang="less">
@import "ant-design-vue/dist/antd.variable.less";

//自定义滚动条 参考：https://blog.csdn.net/u012551928/article/details/109286853
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  /*-webkit-gradient(linear, left bottom, left top, color-stop(0.44, rgb(40, 93, 76)), color-stop(0.72, rgb(253, 187, 45)), color-stop(0.86, rgb(253, 187, 45)));*/
  background-color: @primary-3;
  transition: 0.3s ease-in-out;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #F5F5F5;
}
</style>
