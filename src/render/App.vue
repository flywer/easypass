<script setup lang="ts">
import {ref} from 'vue'
import WindowBtn from '@render/components/base/WindowBtn.vue'
import LeftSiderMenu from '@render/components/base/LeftSiderMenu.vue'
import CenterContent from '@render/components/base/CenterContent.vue'

const manuKey = ref('')

// 接收子组件传过来的值，此为响应函数
const getMenuKey = (value) => {
  manuKey.value = value
}

</script>

<template>
  <WindowBtn/>
  <a-layout has-sider style="min-height: 100vh;">
    <!-- 左菜单 -->
    <LeftSiderMenu @getKey="getMenuKey"/>
    <!-- 中心内容组件载体 -->
    <CenterContent :menu-key="manuKey"/>
  </a-layout>
</template>

<style scoped>


</style>
