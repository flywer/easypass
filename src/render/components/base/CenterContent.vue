<!-- 中心内容组件载体 -->
<script setup lang="ts">
import {watch} from 'vue'
import {useRouter} from 'vue-router'
import {store} from "@render/store";

const router = useRouter()

watch(() => store.selectedMenuKeys.at(0), (value) => {
  if (value === '100') {
    router.push({name: 'groupMgt', params: {key: value}})
  } else if (value === '200') {
    router.push({name: 'commonAccount'})
  } else if (value === '400') {
    router.push({name: 'dataSource'})
  } else if (value === '500') {
    router.push({name: 'settings'})
  }
})

</script>

<template>
  <a-layout id="layout">
    <router-view/>
  </a-layout>
</template>

<style scoped lang="less">
#layout {
  margin-left: 150px;
}
</style>

<!--全局css-->
<style lang="less">
@import "ant-design-vue/dist/antd.variable.less";

#tool-header {
  background: #fff;
  margin: 40px 8px 8px 8px;
  -webkit-border-radius: 5px;
  height: auto;
  line-height: normal;
  padding: 2px 8px 2px 8px;

  .divider {
    height: 23px;
    width: 2px;
    background-color: #ececec;
    padding-left: 0;
    padding-right: 0;
    text-align: center;
  }

  .icon {
    font-size: 20px;
    color: #545454;
  }

  /*  .tool-btn {
      padding: 0 6px;
    }*/
}

#content-view {
  margin: 0 8px;
  background-color: #ececec;
  padding: 20px 20px 10px 20px;
  min-height: 470px;
  max-height: 470px;
  overflow-y: auto;

  .pagination {
    text-align: center;
    bottom: 10px;
  }
}

</style>
