<template>
  <a-row class="sider-tool-row" :gutter="2" style="margin-left: 8px;">
    <a-col>
      <a-button type="text" class="sider-tool-btn" title="锁屏" @click="onLockApp">
        <template #icon>
          <lock-outlined class="icon"/>
        </template>
      </a-button>
    </a-col>
    <a-col>
      <a-button type="text" class="sider-tool-btn" title="常用账号" @click="onCopyCommonAccount">
        <template #icon>
          <span class="icon" style="position: absolute;
    bottom: 9px;
    left: 26%;
    font-size: 13px;
    font-weight: bold;">账</span>
        </template>
      </a-button>
    </a-col>
    <a-col>
      <a-button type="text" class="sider-tool-btn" title="常用密码" @click="onCopyCommonPassword">
        <template #icon>
          <span class="icon" style="position: absolute;
    bottom: 8px;
    left: 26%;
    font-size: 13px;
    font-weight: bold;">密</span>
        </template>
      </a-button>
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
import {LockOutlined} from "@ant-design/icons-vue";
import {store} from "@render/store";
import {getCommonTextContent, lockApp} from "@render/api/app.api";
import {message} from "ant-design-vue";
import {copyText} from "@render/utils/clipboard";

const onLockApp = () => {
  if (store.haveToken)
    lockApp()
  else
    message.info('未设置应用令牌')
}

const onCopyCommonAccount = () => {
  getCommonTextContent().then(res => {
    if (res.data.success) {
      copyText(res.data.result.commonAccount, true);
    }
  })
}

const onCopyCommonPassword = () => {
  getCommonTextContent().then(res => {
    if (res.data.success) {
      copyText(res.data.result.commonPassword, true);
    }
  })
}

</script>
<style scoped lang="less">
@import "ant-design-vue/dist/antd.variable.less";

.sider-tool-row {
  position: absolute;
  bottom: 5.7%;
  width: 100%;
  background-color: @primary-1;

  .sider-tool-btn {
    height: 35px;
    border: 0;
  }

  .icon {
    color: @primary-6;
  }
}

</style>
