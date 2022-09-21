<!--左侧菜单-->
<template>
  <a-layout-sider v-model:collapsed="collapsed" collapsible width="150" id="components-layout-demo-side">
    <div class="logo">
<!--      <p>easy pass</p>--></div>
    <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        @click="menuClick">
      <a-menu-item key="100">
        <lock-outlined/>
        <span>密码管理</span>
      </a-menu-item>
      <a-menu-item key="200">
        <desktop-outlined/>
        <span>常用密码</span>
      </a-menu-item>
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
const selectedKeys = ref(['100'])

// 使用defineEmits注册一个自定义事件
const emit = defineEmits(["getKey"])

//菜单点击事件，每次点击，通过getKey事件发送selectedKeys的值
const menuClick = (item) => {
  emit("getKey", item.key)
}

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
