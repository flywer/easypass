<script setup lang="ts">
import {nextTick, onMounted, ref, watch} from "vue";
import UISettings from "@render/components/settings/ui/UISettings.vue";
import CommonSettings from "@render/components/settings/common/CommonSettings.vue";
import UserSettings from "@render/components/settings/user/UserSettings.vue";
import {useRoute} from "vue-router";
import {isNull} from "lodash-es";

const tabActiveKey = ref('1')
const route = useRoute()

onMounted(()=>{
    if (!isNull(route.params.tabActiveKey)) {
      tabActiveKey.value = route.params.tabActiveKey as string
    }
})

watch(() => route.params.tabActiveKey, (value) => {
  if (!isNull(value)) {
    tabActiveKey.value = value as string
  }
})

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
