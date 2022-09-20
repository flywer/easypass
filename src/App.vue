<template>
  <WindowBtn/>
  <a-layout style="min-height: 100vh">
    <!-- 左菜单-->
    <LeftSiderMenu/>
    <!--中心内容组件载体-->
    <CenterContent/>
  </a-layout>
</template>

<script setup>
import WindowBtn from './components/base/WindowBtn.vue';
import LeftSiderMenu from './components/base/LeftSiderMenu.vue';
import CenterContent from "./components/base/CenterContent.vue";
</script>

