<!-- 窗口的右上角三个操作按钮 -->
<script setup lang="ts">
import {BorderOutlined, CloseOutlined, MinusOutlined} from '@ant-design/icons-vue'
import {setWindow} from '@render/api/app.api'
import {ref} from 'vue'

const appName = ref('easyPass')

async function maxWindowBtn() {
  await setWindow('window-max')
}

async function minWindowBtn() {
  await setWindow('window-min')
}

async function closeWindowBtn() {
  await setWindow('window-close')
}
</script>

<template>
  <a-layout id="topBar">
    <a-layout-content>
      <div class="appName">
        {{ appName }}
      </div>
      <section id="btnGroup" style="float: right">
        <a-button type="text" class="windowBtn" @click="minWindowBtn">
          <MinusOutlined/>
        </a-button>
        <!--        <a-button type="text" class="windowBtn" @click="maxWindowBtn">
                  <BorderOutlined/>
                </a-button>-->
        <a-button type="text" class="closeWindowBtn" @click="closeWindowBtn">
          <CloseOutlined/>
        </a-button>
      </section>
    </a-layout-content>
  </a-layout>
</template>

<style scoped lang="less">

#topBar {
  -webkit-app-region: drag;/*头部可拖动*/
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;

  .appName {
    float: left;
    text-align: center;
    line-height: 32px;
    height: 32px;
    margin-left: 12px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  }

  #btnGroup {
    -webkit-app-region: no-drag;
  }
}

a {
  text-decoration-line: none;
  text-decoration-color: #1a1a1a;
}

@import "ant-design-vue/dist/antd.variable.less";

.windowBtn:hover {
  background-color: @primary-3;
}

.closeWindowBtn:hover {
  background-color: @error-color-active;
}
</style>
