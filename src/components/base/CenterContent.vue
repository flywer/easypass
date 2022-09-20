<!--中心内容组件载体-->
<template>
  <a-layout>
    <a-layout-header style="background: #fff; padding: 0"/>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>User</a-breadcrumb-item>
        <a-breadcrumb-item>Bill</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        Bill is a cat.
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup>


</script>

<style scoped>

</style>
