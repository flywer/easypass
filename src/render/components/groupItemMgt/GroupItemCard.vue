<template>
  <a-card :data-id="item.itemId"
          :bordered="false"
          :hoverable="true"
          size="small"
          class="animate__animated animate__flipInX"
  >
    <template #title>
      <a-space>
        <a-avatar v-if="item.iconUrl!=null" shape="square" :src="item.iconUrl"/>
        <a-avatar v-else shape="square">{{ item.title.slice(0,1) }}</a-avatar>
        {{ item.title }}
        <a-space v-for="(showItem) in item.showItems">
          <a-divider type="vertical" style="background-color: #f0f0f0"/>
          <span>{{ showItem.title }}：{{ showItem.value }}</span>
          <copy-outlined @click="copyText(showItem.value,true)"/>
        </a-space>
      </a-space>
    </template>

    <template #extra>
      <ItemCardExtra :item="item"
                     :group-items-list="groupItemsList"
                     @showItemInfo="updateItemInfo"
                     @updateList="searchItemsByPage(true)"
      />
    </template>
  </a-card>
</template>
<script setup lang="ts">
import ItemCardExtra from "@render/components/groupItemMgt/ItemCardExtra.vue";
import {copyText} from "@render/utils/clipboard";
import {CopyOutlined} from '@ant-design/icons-vue'

const props = defineProps({
  item: {},
  groupItemsList: null
})

// 定义事件
const emit = defineEmits(['showItemInfo', 'updateList'])


const updateItemInfo = ({model, visible}) => {
  // 关闭弹窗
  emit('showItemInfo', {model: model, visible: visible})
}

const searchItemsByPage = (init: boolean) => {
  emit('updateList', init)
}


</script>
<style scoped lang="less">
@import "ant-design-vue/dist/antd.variable.less";

</style>
