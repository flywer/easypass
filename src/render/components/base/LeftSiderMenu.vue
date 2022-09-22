<!-- 左侧菜单 -->
<script setup lang="ts">
import {
  DatabaseOutlined,
  DesktopOutlined,
  LockOutlined,
  SettingOutlined,
  UploadOutlined,
} from '@ant-design/icons-vue'
import { ref } from 'vue'

// 使用defineEmits注册一个自定义事件
const emit = defineEmits(['getKey'])
const collapsed = ref<boolean>(false)
const selectedKeys = ref<string[]>(['100'])

// 菜单点击事件，每次点击，通过getKey事件发送selectedKeys的值
const menuClick = (item) => {
  emit('getKey', item.key)
}
</script>

<template>
  <a-layout-sider id="components-layout-demo-side" v-model:collapsed="collapsed" collapsible width="150">
    <div class="logo">
      <!--      <p>easy pass</p> -->
    </div>
    <a-menu
      v-model:selectedKeys="selectedKeys"
      theme="dark"
      mode="inline"
      @click="menuClick"
    >
      <a-menu-item key="100">
        <LockOutlined />
        <span>密码管理</span>
      </a-menu-item>
      <a-menu-item key="200">
        <DesktopOutlined />
        <span>常用密码</span>
      </a-menu-item>
      <a-menu-item key="300">
        <UploadOutlined />
        <span>导入密码</span>
      </a-menu-item>
      <a-menu-item key="400">
        <DatabaseOutlined />
        <span>数据源</span>
      </a-menu-item>
      <a-menu-item key="500">
        <SettingOutlined />
        <span>设置</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<style scoped lang="less">
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.1);
  font-weight: bolder;
  color: white;
  text-align: center;
  font-size: 20px;

  p {
    padding: 2px;
    text-align: center;
    overflow: hidden;
    text-overflow: fade;
    white-space: nowrap;
  }
}
</style>
