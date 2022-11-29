<!-- 左侧菜单 -->
<script setup lang="ts">
import {DatabaseOutlined, DesktopOutlined, LockOutlined, SettingOutlined, UploadOutlined,} from '@ant-design/icons-vue'
import {store} from "@render/store";
import AppBottomTool from "@render/components/base/AppBottomTool.vue";
</script>

<template>
  <a-layout-sider id="layout-sider" width="150">
    <div class="logo" style="background-color: #cebfbf">
      <p class="title">Easy Pass</p>
    </div>
    <a-menu
        v-model:selectedKeys="store.selectedMenuKeys"
        theme="light"
        mode="inline"
        style="height: 472px;
        user-select: none;"
    >
      <a-menu-item key="100">
        <LockOutlined/>
        <span>账号管理</span>
      </a-menu-item>
      <a-menu-item key="200">
        <DesktopOutlined/>
        <span>常用账号</span>
      </a-menu-item>
      <a-menu-item key="300">
        <UploadOutlined/>
        <span>批量导入</span>
      </a-menu-item>
      <a-menu-item key="400">
        <DatabaseOutlined/>
        <span>数据源</span>
      </a-menu-item>
      <a-menu-item key="500">
        <SettingOutlined/>
        <span>设置</span>
      </a-menu-item>
    </a-menu>
    <AppBottomTool/>
  </a-layout-sider>
</template>

<style scoped lang="less">
@import "ant-design-vue/dist/antd.variable.less";

#layout-sider {
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 32px;
  bottom: 0;
  background-color: #f8f8f8;

  .logo {
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
}

.title {
  background-color: @primary-color;
}

</style>
