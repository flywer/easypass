<template>
  <a-row type="flex">
    <a-col flex="auto">
      <a-card class="card-view" :bordered="false" size="small"
              style="height: 60px;line-height: 36px;padding: 0 12px;text-align: center">
        <a-layout-content>
          <div class="card-left-title">
            <slot name="left">
              <slot name="secondary"></slot>
            </slot>
          </div>
          <div style="float: right">
            <slot name="right">

            </slot>
          </div>
        </a-layout-content>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">

</script>

<style scoped lang="less">
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

  .update-progress {
    float: left;
    position: absolute;
    bottom: 7%;
    margin-left: 12px
  }
}

</style>
