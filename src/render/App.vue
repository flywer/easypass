<script setup lang="ts">
import {onMounted, ref} from 'vue'
import WindowBtn from '@render/components/base/WindowBtn.vue'
import LeftSiderMenu from '@render/components/base/LeftSiderMenu.vue'
import CenterContent from '@render/components/base/CenterContent.vue'
import {ConfigProvider} from 'ant-design-vue';
import {getAppTheme} from "@render/api/app.api";
import {store} from "@render/store";

const manuKey = ref('')

// 接收子组件传过来的值，此为响应函数
const getMenuKey = (value) => {
  manuKey.value = value
}
onMounted(() => {
  autoThemeConfig()
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
