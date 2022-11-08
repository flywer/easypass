<template>
  <a-layout-content class="setting-content">
    <!--主题色-->
    <RowCard>
      <template #left>主题色</template>
      <template #right>
        <input
            type="color"
            :value="colorState.primaryColor"
            @input="onColorChange('primaryColor', $event)"
            @blur="handleSaveTheme('primaryColor',$event)"
            style="border: none;cursor: pointer"
        />
        <span style="color: var(--ant-primary-color)"/>
      </template>
    </RowCard>
  </a-layout-content>
</template>
<script setup lang="ts">
import RowCard from "@render/components/settings/RowCard.vue";
import {reactive} from "vue";
import {store} from "@render/store";
import {ConfigProvider} from "ant-design-vue";
import {setAppTheme} from "@render/api/app.api";

/*主题色*/
const colorState = reactive(store.theme);
/*改变主题色*/
const onColorChange = (type: string, e: any) => {
  Object.assign(colorState, {[type]: e.target.value});
  ConfigProvider.config({
    theme: colorState,
  });
};
/*保存主题色*/
const handleSaveTheme = async (type: string, e: any) => {
  Object.assign(colorState, {[type]: e.target.value});
  ConfigProvider.config({
    theme: colorState,
  });
  await setAppTheme(JSON.stringify(colorState))
}

</script>
<style scoped lang="less">
@import "ant-design-vue/dist/antd.variable.less";
</style>
