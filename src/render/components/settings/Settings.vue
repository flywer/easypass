<script setup lang="ts">
import {ref} from "vue";

const checked1 = ref<boolean>(false);
const checked2 = ref<boolean>(false);
</script>

<template>
  <a-layout-content id="setting-content" style="padding: 10px">

    <a-row type="flex">
      <a-col flex="auto">
        <a-card class="card-view" :bordered="false" size="small"
                style="height: 60px;line-height: 36px;padding: 0 12px;text-align: center">
          <a-layout-content>
            <div class="card-left-title">
              开机自启动
            </div>
            <div style="float: right">
              <a-switch v-model:checked="checked1"/>
            </div>
          </a-layout-content>
        </a-card>
      </a-col>
    </a-row>

    <a-row type="flex">
      <a-col flex="auto">
        <a-card class="card-view" :bordered="false" size="small"
                style="height: 60px;line-height: 36px;padding: 0 12px;text-align: center">
          <a-layout-content>
            <div class="card-left-title">
              启动时最小化到托盘
            </div>
            <div style="float: right">
              <a-switch v-model:checked="checked2"/>
            </div>
          </a-layout-content>
        </a-card>
      </a-col>
    </a-row>

    <a-row type="flex">
      <a-col flex="auto">
        <a-card class="card-view" :bordered="false" size="small"
                style="height: 60px;line-height: 36px;padding: 0 12px;text-align: center">
          <a-layout-content>
            <div class="card-left-title">
              启用托盘图标
              <a-typography-text type="secondary" style="font-size: 12px">禁用此选项时关闭主窗口将直接退出程序
              </a-typography-text>
            </div>
            <div style="float: right">
              <a-switch v-model:checked="checked2"/>
            </div>
          </a-layout-content>
        </a-card>

      </a-col>
    </a-row>

    <a-divider style="height: 2px;background-color: rgba(211,211,211,0.82);margin: 4px 0 12px 0;padding: 0 2px"/>

    <a-row type="flex">
      <a-col flex="auto">
        <a-card class="card-view" :bordered="false" size="small"
                style="height: 60px;line-height: 36px;padding: 0 12px;text-align: center">
          <a-layout-content>
            <div class="card-left-title">
              启用托盘图标
              <a-typography-text type="secondary" style="font-size: 12px">禁用此选项时关闭主窗口将直接退出程序
              </a-typography-text>
            </div>
            <div style="float: right">
              <a-switch v-model:checked="checked2"/>
            </div>
          </a-layout-content>
        </a-card>

      </a-col>
    </a-row>

    <a-row type="flex">
      <a-col flex="auto">
        <a-card class="card-view" :bordered="false" size="small"
                style="height: 60px;line-height: 36px;padding: 0 12px;text-align: center">
          <a-layout-content>
            <div class="card-left-title">
              启用托盘图标
              <a-typography-text type="secondary" style="font-size: 12px">禁用此选项时关闭主窗口将直接退出程序
              </a-typography-text>
            </div>
            <div style="float: right">
              <a-switch v-model:checked="checked2"/>
            </div>
          </a-layout-content>
        </a-card>

      </a-col>
    </a-row>
    <a-row type="flex">
      <a-col flex="auto">
        <a-card class="card-view" :bordered="false" size="small"
                style="height: 60px;line-height: 36px;padding: 0 12px;text-align: center">
          <a-layout-content>
            <div class="card-left-title">
              启用托盘图标
              <a-typography-text type="secondary" style="font-size: 12px">禁用此选项时关闭主窗口将直接退出程序
              </a-typography-text>
            </div>
            <div style="float: right">
              <a-switch v-model:checked="checked2"/>
            </div>
          </a-layout-content>
        </a-card>

      </a-col>
    </a-row>
    <a-row type="flex">
      <a-col flex="auto">
        <a-card class="card-view" :bordered="false" size="small"
                style="height: 60px;line-height: 36px;padding: 0 12px;text-align: center">
          <a-layout-content>
            <div class="card-left-title">
              启用托盘图标
              <a-typography-text type="secondary" style="font-size: 12px">禁用此选项时关闭主窗口将直接退出程序
              </a-typography-text>
            </div>
            <div style="float: right">
              <a-switch v-model:checked="checked2"/>
            </div>
          </a-layout-content>
        </a-card>

      </a-col>
    </a-row>
    <a-row type="flex">
      <a-col flex="auto">
        <a-card class="card-view" :bordered="false" size="small"
                style="height: 60px;line-height: 36px;padding: 0 12px;text-align: center">
          <a-layout-content>
            <div class="card-left-title">
              启用托盘图标
              <a-typography-text type="secondary" style="font-size: 12px">禁用此选项时关闭主窗口将直接退出程序
              </a-typography-text>
            </div>
            <div style="float: right">
              <a-switch v-model:checked="checked2"/>
            </div>
          </a-layout-content>
        </a-card>

      </a-col>
    </a-row>
  </a-layout-content>
</template>

<style scoped lang="less">
#setting-content {
  margin-top: 32px;
  //height: 532px;
  .card-view {
    box-shadow: 0 1px 2px -2px rgb(0 0 0 / 16%),
    0 3px 6px 0 rgb(0 0 0 / 12%),
    0 5px 12px 4px rgb(0 0 0 / 9%);
    border-radius: 5px;
    margin-bottom: 12px;

    .card-left-title {
      float: left;
      -webkit-user-select: none; /*不可选*/
    }
  }
}


</style>
