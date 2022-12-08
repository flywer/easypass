<!-- 窗口的右上角三个操作按钮 -->
<script setup lang="ts">
import {CloseOutlined, MinusOutlined, PushpinOutlined} from '@ant-design/icons-vue'
import {getAppVersion, setWindow} from '@render/api/app.api'
import {onMounted, ref} from 'vue'

const appName = ref('EasyPass')
const appVersion = ref()
const windowTop = ref(false)

const maxWindowBtn = async () => {
  await setWindow('window-max')
}

const minWindowBtn = async () => {
  await setWindow('window-min')
}

const closeWindowBtn = async () => {
  await setWindow('window-close')
}

const setWindowTop = async () => {
  windowTop.value = !windowTop.value
  if (windowTop.value)
    await setWindow('window-top')
  else
    await setWindow('window-un-top')
}

onMounted(async () => {
  appVersion.value = (await getAppVersion()).data.result
})

</script>

<template>
  <a-layout id="top-bar">
    <a-layout-content>
      <div class="app-name">
        {{ appName }}&nbsp;v{{ appVersion }}
      </div>
      <section id="btn-group" style="float: right">
        <a-button :type="windowTop?'primary':'text'" :class="!windowTop?'window-btn':''"
                  @click="setWindowTop">
          <pushpin-outlined/>
        </a-button>
        <a-button type="text" class="window-btn" @click="minWindowBtn">
          <MinusOutlined/>
        </a-button>
        <!--<a-button type="text" class="window-btn" @click="maxWindowBtn">
          <BorderOutlined/>
        </a-button>-->
        <a-button type="text" class="close-window-btn" @click="closeWindowBtn">
          <CloseOutlined/>
        </a-button>
      </section>
    </a-layout-content>
  </a-layout>
</template>

<style scoped lang="less">

#top-bar {
  -webkit-app-region: drag; /*头部可拖动*/
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;
  user-select: none;

  .app-name {
    float: left;
    text-align: center;
    line-height: 32px;
    height: 32px;
    margin-left: 12px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  }

  #btn-group {
    -webkit-app-region: no-drag;
  }
}

a {
  text-decoration-line: none;
  text-decoration-color: #1a1a1a;
}

@import "ant-design-vue/dist/antd.variable.less";

.window-btn:hover {
  background-color: @primary-3;
}

.close-window-btn:hover {
  background-color: @error-color-active;
}

.window-btn-active {
  background-color: @primary-3;
}
</style>
