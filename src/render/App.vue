<script setup lang="ts">
import {createVNode, onMounted, ref} from 'vue'
import WindowBtn from '@render/components/base/WindowBtn.vue'
import LeftSiderMenu from '@render/components/base/LeftSiderMenu.vue'
import CenterContent from '@render/components/base/CenterContent.vue'
import {ConfigProvider, Modal} from 'ant-design-vue';
import {getAppTheme, quitAndInstall} from "@render/api/app.api";
import {store} from "@render/store";
import {ipcInstance} from "@render/plugins";
import {channel} from "@render/api/channel";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";

const manuKey = ref('')

// 接收子组件传过来的值，此为响应函数
const getMenuKey = (value) => {
  manuKey.value = value
}

onMounted(() => {
  ipcInstance.on(channel.app.sendDefaultTheme, () => {
    autoThemeConfig()
  })
  ipcInstance.on(channel.app.sendUpdateDownloaded, res => {
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
})

//配置动态主题
const autoThemeConfig = async () => {
  await getAppTheme().then(res => {
    if (res.data.success) {
      store.theme = res.data.result
    } else {
      console.error(res.data.message)
      store.theme = {
        "primaryColor": "#1890ff",
        "errorColor": "#ff4d4f",
        "warningColor": "#faad14",
        "successColor": "#52c41a",
        "infoColor": "#1890ff"
      }
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
