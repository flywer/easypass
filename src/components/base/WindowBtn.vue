<!-- 窗口的右上角三个操作按钮 -->
<template>
  <a-layout id="topBar">
    <a-layout-content>
      <div class="appName">
        {{ appName }}
      </div>
      <section style="float: right" id="btnGroup">
        <a-button type="text" @click="minWindowBtn">
          <minus-outlined/>
        </a-button>
        <a-button type="text" @click="maxWindowBtn">
          <border-outlined/>
        </a-button>
        <a-button type="text" @click="closeWindowBtn">
          <close-outlined/>
        </a-button>
      </section>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import {CloseOutlined, MinusOutlined, BorderOutlined} from '@ant-design/icons-vue';
import {ref} from "vue";

const appName = ref("easyPass")

function maxWindowBtn() {
  window.electronAPI.setWindow("window-max");
}

function minWindowBtn() {
  window.electronAPI.setWindow("window-min");
}

function closeWindowBtn() {
  window.electronAPI.setWindow("window-close");
}
</script>

<style scoped lang="less">
#topBar {
  -webkit-app-region: drag;
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
</style>
