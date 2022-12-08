<template>
  <a-row type="flex" style="margin-bottom: 12px">
    <a-col flex="auto">
      <a-card class="card-view" :bordered="false" size="small">
        <a-layout-content>
          <div class="card-left-title">
            <slot name="left">
              <slot name="secondary"></slot>
            </slot>
          </div>
          <div style="float: right">
            <slot name="right"></slot>
          </div>
        </a-layout-content>
      </a-card>
      <transition
          enter-active-class="animate__animated animate__flipInX animate__faster"
          leave-active-class="animate__animated animate__flipOutX animate__faster"
      >
        <a-card class="bottom-card" v-show="bottomCardVisible">
          <slot name="bottom-card"></slot>
        </a-card>
      </transition>

    </a-col>
  </a-row>
</template>

<script setup lang="ts">
const props = defineProps({
  bottomCardVisible: Boolean
})
</script>

<style scoped lang="less">
.card-view {
  box-shadow: 0 1px 2px -2px rgb(0 0 0 / 16%),
  0 3px 6px 0 rgb(0 0 0 / 12%),
  0 5px 12px 4px rgb(0 0 0 / 9%);
  border-radius: 5px;
  height: 60px;
  max-height: 56px;
  line-height: 36px;
  padding: 0 12px;
  text-align: center;
  z-index: 1000;

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

  .card-image-left {
    background-color: #0078ff;
    width: 20px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
}

.bottom-card {
  width: 98%;
  margin: 0 auto;
  box-shadow: 0 3px 6px 0 rgb(0 0 0 / 12%);
  border-radius: 3px;
}

</style>

<style lang="less">
.row-card-form {
  max-height: 32px;
}
</style>
