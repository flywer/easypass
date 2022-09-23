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
