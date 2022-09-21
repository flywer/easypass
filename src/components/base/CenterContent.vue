<!--中心内容组件载体-->
<template>
  <a-layout>
    <router-view></router-view>
  </a-layout>
</template>

<script setup>
import {ref, watch} from "vue";
import {useRouter} from "vue-router"

const router = useRouter()

const menuKeyValue = ref("")

const props = defineProps({
  menuKey: {
    type: String,
    default: ""
  }
})

watch(() => props.menuKey, () => {
  menuKeyValue.value = props.menuKey;
  router.push(
      {
        name: 'pwdMgt',
        params: {key: props.menuKey}
      })
})


</script>

<style scoped>

</style>
