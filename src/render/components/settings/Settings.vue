<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {getOpenAtLogin, setAppTheme, setOpenAtLogin} from "@render/api/app.api";
import {IpcResponse} from "einf";
import {ConfigProvider} from "ant-design-vue";
import {store} from "@render/store";

/*开机自启动*/
const openAtLoginChecked = ref<boolean>(false);

const setOpenAtLoginChecked = () => {
  setOpenAtLogin(openAtLoginChecked.value)
}

const checked2 = ref<boolean>(false);

onMounted(async () => {
  openAtLoginChecked.value = (await getOpenAtLogin()).data
})

const colorState = reactive(store.theme);

const onColorChange = (type: string, e: any) => {
  Object.assign(colorState, {[type]: e.target.value});
  ConfigProvider.config({
    theme: colorState,
  });
};

const handleSaveTheme = async (type: string, e: any) => {
  Object.assign(colorState, {[type]: e.target.value});
  ConfigProvider.config({
    theme: colorState,
  });
  await setAppTheme(JSON.stringify(colorState))
}

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
              <a-switch v-model:checked="openAtLoginChecked" @click="setOpenAtLoginChecked"/>
            </div>
          </a-layout-content>
        </a-card>
      </a-col>
    </a-row>

    <!--    <a-row type="flex">
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
        </a-row>-->

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
              主题色
              <a-typography-text type="secondary" style="font-size: 12px">
              </a-typography-text>
            </div>
            <div style="float: right">
              <input
                  type="color"
                  :value="colorState.primaryColor"
                  @input="onColorChange('primaryColor', $event)"
                  @blur="handleSaveTheme('primaryColor',$event)"
                  style="border: none;cursor: pointer"
              />
              <span style="color: var(--ant-primary-color)"/></div>
          </a-layout-content>
        </a-card>

      </a-col>
    </a-row>

    <a-divider style="height: 2px;background-color: rgba(211,211,211,0.82);margin: 4px 0 12px 0;padding: 0 2px"/>

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
