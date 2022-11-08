<script setup lang="ts">
import {cloneDeep, isEqual, isNull} from "lodash-es";
import {
  deleteGroupItemByItemId,
  getItemsListByItemId,
  saveOrUpdateGroupItems,
  setGroupItemCommon, updateGroupIdByItemId
} from "@render/api/groupItem.api";
import {message, Modal} from "ant-design-vue";
import {useRouter} from "vue-router";
import {createVNode, reactive, ref} from "vue";
import {
  EditOutlined,
  TableOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  StarTwoTone,
  StarOutlined,
  MoreOutlined,
  DragOutlined,
  FolderOutlined
} from '@ant-design/icons-vue'
import {getGroupListByUserInfo} from "@render/api/group.api";
import {store} from "@render/store";

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
      emit('showItemInfo', {model: model, visible: true})
    } else {
      message.error(res.data.message)
    }
  }).catch(e => {
    console.error(e)
  })
}

/*跳转到编辑页面*/
const showUpdateModal = (itemId: string) => {
  router.push(
      {
        name: 'groupItemTableForm',
        query: {
          itemId: itemId,
          groupId: props.item.groupId
        }
      }
  )
}

/*删除*/
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
          emit('updateList', true)
        } else
          message.error(res.data.message)
      })
    },
  });
}

/*移动*/
const onShowMoveModal = async (itemId: string) => {
  itemMoveRef.modalVisible = true
  itemMoveRef.groupList = (await getGroupListByUserInfo({id: store.user.id})).data.result
  itemMoveRef.selectedItemId = itemId
}

const itemMoveRef = reactive({
  modalVisible: false,
  groupList: [],
  selectedGroupId: null,/*当前选中的组*/
  selectedItemId: null,/*当前选择的组项*/
})

/*选择组时*/
const onSelectGroup = (groupId: string) => {
  //先清除选择的组
  itemMoveRef.groupList.forEach(item => {
    item.isSelected = false
  })
  itemMoveRef.groupList = cloneDeep(itemMoveRef.groupList)

  let selectedGroup = itemMoveRef.groupList.filter(item => isEqual(item.id, groupId)).at(0)
  selectedGroup.isSelected = true
  itemMoveRef.selectedGroupId = groupId
}

/*确认移动*/
const onMove = () => {
  updateGroupIdByItemId({itemId: itemMoveRef.selectedItemId, groupId: itemMoveRef.selectedGroupId}).then(res => {
    if (res.data.success) {
      message.success('已移动至 '+ itemMoveRef.groupList.filter(item => isEqual(item.id, itemMoveRef.selectedGroupId)).at(0).name)
      itemMoveRef.modalVisible = false
      emit('updateList', true)
    } else {
      message.error(res.data.message)
    }
  })
}

</script>

<template>
  <a-space :size="10">
    <a-divider type="vertical" style="background-color: #f0f0f0"/>
    <a-button type="text"
              class="card-extra-btn"
              title="设为常用"
              @click="onSetCommonAccount(item.isCommon,item.itemId,$event)"
    >
      <star-two-tone v-show="item.isCommon" two-tone-color="#fadb14"
                     class="card-extra-btn-icon animate__animated animate__tada"/>
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
    <!--更多-->
    <a-popover placement="bottom">
      <template #content>
        <a-button type="text" @click="onShowMoveModal(item.itemId)">
          <template #icon>
            <drag-outlined/>
          </template>
          移动
        </a-button>
      </template>
      <more-outlined class="card-extra-btn-icon"/>
    </a-popover>
  </a-space>

  <a-modal
      v-model:visible='itemMoveRef.modalVisible'
      width="50%"
      height="318px"
      title="移动到"
      :closable="true"
      ok-text="移动至此"
      cancel-text="取消"
      @ok=""
      @cancel=""
  >
    <div style="max-height: 245px;overflow-y: auto;">
    <a-row v-for="group in itemMoveRef.groupList" style="margin-bottom: 4px;">
      <a-col style="width: 100%" :class="group.isSelected?'':'group-col'">
        <div style="width: 100%;height: 48px;cursor: pointer" @click="onSelectGroup(group.id)"
             :class="group.isSelected?'selected':'unSelected'">
          <a-space align="center" style="height: 100%;padding-left: 5px;">
            <folder-outlined style="font-size: 24px;"/>
            {{ group.name }}
          </a-space>
        </div>
      </a-col>
    </a-row>
    </div>
    <template #footer>
      <a-button @click="itemMoveRef.modalVisible = false">取消</a-button>
      <a-button type="primary" :disabled="isNull(itemMoveRef.selectedGroupId)" @click="onMove">移动至此</a-button>
    </template>
  </a-modal>

</template>

<style scoped lang="less">
@import "ant-design-vue/dist/antd.variable.less";

.card-extra-btn-icon {
  font-size: 15px
}

.card-extra-btn {
  padding: 0;
}

.group-col {
  :hover {
    background-color: @primary-2;
  }
}

.selected {
  background-color: @primary-3;
}

.unSelected {
  background: none;
}

</style>
