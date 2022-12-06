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
          <span class="icon acc-icon">账</span>
        </template>
      </a-button>
    </a-col>
    <a-col>
      <a-button type="text" class="sider-tool-btn" title="常用密码" @click="onCopyCommonPassword">
        <template #icon>
          <span class="icon pwd-icon">密</span>
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
import {isNull} from "lodash-es";
import {h} from "vue";
import {useRouter} from "vue-router";
import {uuid} from "vue3-uuid";
import {routeName} from "@render/router";

const router = useRouter()

const lockAppKey = uuid.v1();
const onLockApp = () => {
  if (store.haveToken)
    lockApp()
  else {
    message.info({
      content: [
        h('span', {}, '未设置应用令牌，'),
        h('a', {
          onClick: () => {
            store.selectedMenuKeys = [routeName.SETTINGS]
            router.push({name: routeName.SETTINGS, params: {tabActiveKey: '3'}}).then(() => {
              message.destroy()
            })
          }
        }, '前往设置')], key: lockAppKey
    })
  }
}

const commonAccountKey = uuid.v1();
const onCopyCommonAccount = () => {
  getCommonTextContent().then(res => {
    if (res.data.success) {
      if (!isNull(res.data.result.commonAccount))
        copyText(res.data.result.commonAccount, true);
      else message.info({
        content: [
          h('span', {}, '未设置常用账户，'),
          h('a', {
            onClick: () => {
              store.selectedMenuKeys = [routeName.SETTINGS]
              router.push({name: routeName.SETTINGS, params: {tabActiveKey: '1'}}).then(() => {
                message.destroy()
              })
            }
          }, '前往设置')], key: commonAccountKey
      })
    }
  })
}

const commonPasswordKey = uuid.v1();
const onCopyCommonPassword = () => {
  getCommonTextContent().then(res => {
    if (res.data.success) {
      if (!isNull(res.data.result.commonPassword))
        copyText(res.data.result.commonPassword, true);
      else message.info({
        content: [
          h('span', {}, '未设置常用密码，'),
          h('a', {
            onClick: () => {
              store.selectedMenuKeys = [routeName.SETTINGS]
              router.push({name: routeName.SETTINGS, params: {tabActiveKey: '1'}}).then(() => {
                message.destroy()
              })
            }
          }, '前往设置')], key: commonPasswordKey
      })
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

  .acc-icon{
    position: absolute;
    bottom: 9px;
    left: 26%;
    font-size: 13px;
    font-weight: bold;
  }

  .pwd-icon{
    position: absolute;
    bottom: 8px;
    left: 26%;
    font-size: 13px;
    font-weight: bold;
  }
}

</style>
