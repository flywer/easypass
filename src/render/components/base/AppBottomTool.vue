<template>
  <a-row class="sider-tool-row" :gutter="2" style="margin-left: 8px;">
    <a-col>
      <a-button type="text" class="sider-tool-btn" title="锁屏" @click="onLockApp">
        <template #icon>
          <lock-outlined class="icon"/>
        </template>
      </a-button>
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
import {LockOutlined} from "@ant-design/icons-vue";
import {store} from "@render/store";
import {lockApp} from "@render/api/app.api";
import {message} from "ant-design-vue";

const onLockApp = () => {
  if (store.haveToken)
    lockApp()
  else
    message.info('未设置应用令牌')
}

</script>
<style scoped lang="less">
@import "ant-design-vue/dist/antd.variable.less";

.sider-tool-row {
  position: absolute;
  bottom: 5.7%;
  width: 100%;
  background-color: @primary-1;

  .icon {
    color: @primary-6;
  }
}

</style>
