<template>
  <a-space :size="10">
    <a-divider type="vertical" style="background-color: #f0f0f0"/>
    <a-button type="text" class="card-extra-btn" title="设为常用"
              @click="onSetCommonAccount(item.isCommon,item.itemId,$event)">
      <star-two-tone v-show="item.isCommon" two-tone-color="#fadb14" class="card-extra-btn-icon"/>
      <star-outlined v-show="!item.isCommon" style="margin: 0" class="card-extra-btn-icon"/>
    </a-button>

    <a-button type="text" class="card-extra-btn" title="详情">
      <table-outlined @click="showAccountItems(item.itemId)" class="card-extra-btn-icon"/>
    </a-button>

    <a-button type="text" class="card-extra-btn" title="编辑">
      <edit-outlined @click="showUpdateModal(item.itemId)" class="card-extra-btn-icon"/>
    </a-button>

    <a-button type="text" class="card-extra-btn" title="删除">
      <delete-outlined @click="onDelete(item.itemId)" class="card-extra-btn-icon"/>
    </a-button>
  </a-space>
</template>

<script setup lang="ts">
import {isEqual} from "lodash-es";
import {deleteGroupItemByItemId, getItemsListByItemId, setGroupItemCommon} from "@render/api/groupItem.api";
import {message, Modal} from "ant-design-vue";
import {useRouter} from "vue-router";
import {createVNode} from "vue";
import {
  EditOutlined,
  TableOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  StarTwoTone,
  StarOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

let props = defineProps({
  item: null,
  groupItemsList: null
})

// 定义事件
const emit = defineEmits(['showItemInfo', 'updateList'])

/*设置常用账号*/
const onSetCommonAccount = (isCommon: boolean, itemId: string, e) => {
  let thisItem = props.groupItemsList.filter(item => isEqual(item.itemId, itemId)).at(0)
  thisItem.isCommon = !thisItem.isCommon
  setGroupItemCommon(itemId, thisItem.isCommon)
}

/*查看*/
const showAccountItems = async (itemId: string) => {
  await getItemsListByItemId(itemId).then(res => {
    if (res.data.success) {
      let model = []
      res.data.result.forEach(item => {
        model.push(item)
      })
      // 关闭弹窗
      emit('showItemInfo', {model:model,visible:true})
    } else {
      message.error(res.data.message)
    }
  }).catch(e => {
    console.error(e)
  })
}

const showUpdateModal = (itemId: string) => {
  router.push(
      {
        name: 'groupItemTableForm',
        query: {
          itemId: itemId,
          groupId:props.item.groupId
        }
      }
  )
}

const onDelete = (itemId: string) => {
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: '确认删除当前组？',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      deleteGroupItemByItemId(itemId).then(res => {
        if (res.data.success) {
          message.success("删除成功！")
          emit('updateList',true)
        } else
          message.error(res.data.message)
      })
    },
  });
}

</script>

<style scoped lang="less">
.card-extra-btn-icon {
  font-size: 15px
}

.card-extra-btn {
  padding: 0;
}
</style>
