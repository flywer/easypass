<script setup lang="ts">
import {ref} from "vue";
import UISettings from "@render/components/settings/UISettings.vue";
import CommonSettings from "@render/components/settings/CommonSettings.vue";
import UserSettings from "@render/components/settings/UserSettings.vue";

const tabActiveKey = ref('1')
</script>

<template>
  <a-tabs v-model:activeKey="tabActiveKey" id="tabs-view" animated>
    <a-tab-pane key="1" tab="用户设置">
      <UserSettings/>
    </a-tab-pane>
    <a-tab-pane key="2" tab="界面设置">
      <UISettings/>
    </a-tab-pane>
    <a-tab-pane key="3" tab="通用设置">
      <CommonSettings/>
    </a-tab-pane>
  </a-tabs>
</template>

<style scoped lang="less">
#tabs-view {
  margin: 32px 8px 0 8px;
  height: 525px;
  overflow-y: auto;

  :deep(.ant-tabs-nav) {
    margin-bottom: 2px;
  }
}
</style>

<!--子组件样式-->
<style scoped lang="less">
.setting-content {
  padding: 10px;

  :deep(.ant-divider) {
    height: 2px;
    background-color: rgb(231 231 231 / 82%);
    margin: 4px 0 12px 0;
    padding: 0 2px
  }
}
</style>
