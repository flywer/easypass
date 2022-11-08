<!--组项列表-->
<script setup lang="ts">
import {store} from "@render/store";
import {useRouter} from "vue-router";
import {onMounted, reactive, ref} from "vue";
import {
  MoreOutlined,
  PlusOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
  CopyOutlined,
} from '@ant-design/icons-vue'
import {
  getGroupItemsListByPage, getItemTypeEnum,
} from "@render/api/groupItem.api";
import empty from '@render/assets/img/empty.png'
import {message, Modal} from "ant-design-vue";
import ItemsInfoModal from "@render/components/groupItemMgt/ItemsInfoModal.vue";
import SearchInput from "@render/components/common/SearchInput.vue";
import {isEmpty, isEqual} from "lodash-es";
import GroupItemCard from "@render/components/groupItemMgt/GroupItemCard.vue";

const router = useRouter()
//从后端传过来的分组数据
let groupItemsList = ref([])
//当前页数
let pageIndex = ref<number>(1)
//每页总数
let pageSize = ref<number>(6)
//分组总数
let groupItemsCount = ref<number>()
//查询model
let modelRef = ref({
  value: {},
  groupId: store.currentGroupId,
  pageIndex: pageIndex.value,
  pageSize: pageSize.value,
  userId: store.user.id
});
//组信息model
let groupModelRef = ref({
  name: store.currentGroupName,
  id: store.currentGroupId
})
//加载效果是否显示
let spinning = ref(true)
//空状态显示
let showEmpty = ref<boolean>(false)
//刷新动画
let refreshSpin = ref(false)

const itemInfoModalRef = reactive({
  model: null,/*详情页信息*/
  visible: null/*是否显示组详情*/
})

/*显示组项更多信息*/
const updateItemInfo = (value) => {
  itemInfoModalRef.model = value.model
  itemInfoModalRef.visible = value.visible
}

/*组项类型*/
const itemType = ref()

onMounted(async () => {
  await searchItemsByPage(true)
  itemType.value = (await getItemTypeEnum()).data.result
})

// click:显示添加账号项
const showAddItemModal = () => {
  router.push({
    name: 'groupItemTableForm',
    query: {
      groupId: store.currentGroupId
    }
  })
}

//刷新动画
const refreshSpinning = () => {
  refreshSpin.value = true
  setTimeout(() => {
    refreshSpin.value = false
  }, 1000)
}

//分页搜索
const searchItemsByPage = async (init: boolean, search?: true) => {
  spinning.value = true
  showEmpty.value = false
  refreshSpinning()

  modelRef.value.pageSize = pageSize.value
  if (isEmpty(modelRef.value.value)) modelRef.value.value = null //空字段查询会异常
  //是否是全量搜索（初始化、刷新）
  if (init) {
    pageIndex.value = 1
    modelRef.value.value = null
    modelRef.value.pageIndex = 1
  } else {
    //是否是搜索框搜索（需回到第一页）
    if (search) {
      pageIndex.value = 1
      modelRef.value.pageIndex = 1
    } else
      modelRef.value.pageIndex = pageIndex.value
  }
  getGroupItemsListByPage(modelRef.value).then(res => {
    if (res.data.success) {
      let itemsRows = res.data.result.rows
      groupItemsCount.value = res.data.result.count
      groupItemsList.value = []
      if (itemsRows.length > 0)
        itemsRows.forEach(arr => {
          let itemObj = {
            itemId: null,
            title: '暂无',
            account: '',
            showItems: [],
            isCommon: false,
            groupId: null,
            iconUrl: null
          }
          //每个组里有多个项，提取每个
          arr.forEach(row => {
            /*标题*/
            if (isEqual(row.type, itemType.value.title)) {
              itemObj.itemId = row.itemId
              itemObj.title = row.value
              itemObj.isCommon = row.isCommon == 1
              itemObj.groupId = row.groupId
            }
            if (isEqual(row.type, itemType.value.icon)) {
              itemObj.iconUrl = isEmpty(row.value) ? null : row.value
            }
            /*主账号*/
            if (isEqual(row.type, itemType.value.account)) {
              itemObj.account = row.value
            }
            /*展示出来的组项*/
            if (row.isShow && !isEqual(row.type, itemType.value.title)) {
              let showItem = {title: null, value: null}
              showItem.title = row.name
              showItem.value = row.value
              itemObj.showItems.push(showItem)
            }
          })
          groupItemsList.value.push(itemObj)
        })
      else showEmpty.value = true
    } else {
      message.error(res.data.message)
    }
  }).then(() => {
    spinning.value = false
  })
}

//router:返回密码组管理页面
const backToGroupMgt = () => {
  store.currentGroupId = null
  store.currentGroupName = null
  router.back()
}

/*查询*/
const onSearch = (value) => {
  modelRef.value.value = value
  searchItemsByPage(false, true)
}

const setItemVisible = (value) => {
  itemInfoModalRef.visible = value
}

</script>

<template>
  <!--  顶部按钮栏 -->
  <a-layout-header id="tool-header">
    <a-space style="gap: 4px">
      <a-space>
        <!--返回-->
        <a-button class="tool-btn" type="text" size="large" @click="backToGroupMgt" title="返回">
          <template #icon>
            <arrow-left-outlined/>
          </template>
          返回
        </a-button>
        <a-typography-title :level="5" style="margin-bottom: -1px">{{ groupModelRef.name }}</a-typography-title>
        <a-divider type="vertical" class="divider" style="height: 17px;"/>
      </a-space>
      <!--新增-->
      <a-button class="tool-btn" type="text" size="large" @click="showAddItemModal" title="新增">
        <template #icon>
          <PlusOutlined/>
        </template>
        新增
      </a-button>
      <!--搜索框-->
      <SearchInput @onSearch="onSearch"/>
    </a-space>
    <!--右侧-->
    <a-space style="float: right">
      <!--刷新-->
      <a-button class="tool-btn" type="text" size="large" @click="searchItemsByPage(true)" title="刷新">
        <template #icon>
          <reload-outlined :spin="refreshSpin"/>
        </template>
        刷新
      </a-button>
      <a-button class="tool-btn" type="text" size="large" title="更多">
        <template #icon>
          <MoreOutlined/>
        </template>
      </a-button>
    </a-space>
  </a-layout-header>
  <!--列表-->
  <a-layout-content id="content-view">
    <a-spin :spinning="spinning">
      <a-row :gutter="16">
        <a-col v-for="(item) in groupItemsList" :span="24" style="margin-bottom: 15px">
          <GroupItemCard
              :item="item"
              :group-items-list="groupItemsList"
              @showItemInfo="updateItemInfo"
              @updateList="searchItemsByPage(true)"/>
        </a-col>
      </a-row>
      <a-pagination v-if="groupItemsList.length>0" class="pagination" v-model:current="pageIndex"
                    :default-page-size="pageSize" :total="groupItemsCount"
                    show-less-items @change="searchItemsByPage(false)"/>
      <a-empty v-show="showEmpty" :image="empty" :image-style="{height: '60px'}">
        <template #description>
        </template>
        <a-button type="primary" @click="showAddItemModal">创建</a-button>
      </a-empty>

    </a-spin>
    <ItemsInfoModal :visible="itemInfoModalRef.visible" :model="itemInfoModalRef.model"
                    @setItemVisible="setItemVisible"/>
  </a-layout-content>

</template>

<style scoped lang="less">
@import "ant-design-vue/dist/antd.variable.less";

#tool-header {
  :deep(.tool-btn):hover {
    background-color: @primary-1;
  }
}

#content-view {
  overflow-x: hidden;
}
</style>
