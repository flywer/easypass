<!-- 中心内容组件载体 -->
<script setup lang="ts">
import {ref, watch} from 'vue'
import {useRouter} from 'vue-router'

const props = defineProps({
  menuKey: {
    type: String,
    default: '',
  },
})

const router = useRouter()

const menuKeyValue = ref('')

watch(() => props.menuKey, () => {
  menuKeyValue.value = props.menuKey
  if (props.menuKey === '100') {
    router.push(
        {
          name: 'pwdMgt',
          params: {key: props.menuKey},
        })
  } else if (props.menuKey === '200') {
    /* router.push(
         {
           name: 'commonPassword',
         })*/
  } else if (props.menuKey === '500') {
    router.push(
        {
          name: 'settings',
        })
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
  height: 500px;
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

  .ant-space-item:hover {
    background-color: @primary-1;
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
  min-height: 465px;
  max-height: 465px;
  overflow-y: auto;

  .pagination {
    text-align: center;
    bottom: 10px;
  }
}

</style>
