<!-- 中心内容组件载体 -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

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
  router.push(
    {
      name: 'pwdMgt',
      params: { key: props.menuKey },
    })
})
</script>

<template>
  <a-layout id="layout">
    <router-view />
  </a-layout>
</template>

<style scoped>
#layout{
  overflow-y: auto;
}
</style>
