<!--左侧菜单-->
<template>
  <a-layout-sider v-model:collapsed="collapsed" collapsible width="150" id="components-layout-demo-side">
    <div class="logo">
      <p>easy pass</p></div>
    <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
      <a-menu-item key="100">
        <lock-outlined/>
        <span>密码管理</span>
      </a-menu-item>
      <a-menu-item key="200">
        <desktop-outlined/>
        <span>常用密码</span>
      </a-menu-item>
      <!--        <a-sub-menu key="sub1">
                <template #title>
                  <span>
                    <user-outlined/>
                    <span>User</span>
                  </span>
                </template>
                <a-menu-item key="3">Tom</a-menu-item>
                <a-menu-item key="4">Bill</a-menu-item>
                <a-menu-item key="5">Alex</a-menu-item>
              </a-sub-menu>-->
      <!--        <a-sub-menu key="sub2">
                <template #title>
                  <span>
                    <team-outlined/>
                    <span>Team</span>
                  </span>
                </template>
                <a-menu-item key="6">Team 1</a-menu-item>
                <a-menu-item key="8">Team 2</a-menu-item>
              </a-sub-menu>-->
      <a-menu-item key="300">
        <upload-outlined/>
        <span>导入密码</span>
      </a-menu-item>
      <a-menu-item key="400">
        <database-outlined/>
        <span>数据源</span>
      </a-menu-item>
      <a-menu-item key="500">
        <setting-outlined/>
        <span>设置</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script setup>
import {
  LockOutlined,
  DesktopOutlined,
  UploadOutlined,
  SettingOutlined,
  DatabaseOutlined,
} from '@ant-design/icons-vue';
import {ref} from 'vue';

const collapsed = ref(false)
const selectedKeys = ref(['1'])

</script>

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
