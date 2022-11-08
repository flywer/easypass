<!--常用账号-->
<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import empty from '@render/assets/img/empty.png'
import {MoreOutlined, ReloadOutlined,} from '@ant-design/icons-vue'
import {getCommonGroupItemsListByPage, getItemTypeEnum} from "@render/api/groupItem.api";
import {message} from "ant-design-vue";
import ItemsInfoModal from "@render/components/groupItemMgt/ItemsInfoModal.vue";
import SearchInput from "@render/components/common/SearchInput.vue";
import {store} from "@render/store";
import {isEmpty, isEqual} from "lodash-es";
import GroupItemCard from "@render/components/groupItemMgt/GroupItemCard.vue";

//加载效果是否显示
const spinning = ref(false)
//从后端传过来的分组数据
const groupItemsList = ref([])
//分页数据
const pageRef = reactive({
  pageIndex: 1,
  pageSize: 6,
  groupItemsCount: 0,
})
//空状态显示
let showEmpty = ref<boolean>(true)
//刷新动画
let refreshSpin = ref(false)
//查询model
let modelRef = ref({
  value: '',
  pageIndex: pageRef.pageIndex,
  pageSize: pageRef.pageSize,
  userId: store.user.id
});
//具体信息
const itemInfoModalRef = reactive({
  model: null,/*详情页信息*/
  visible: null/*是否显示组详情*/
})

//显示具体信息
const updateItemInfo = (value) => {
  itemInfoModalRef.model = value.model
  itemInfoModalRef.visible = value.visible
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
  if (!store.isLogin) {
    message.warn('尚未登录')
    return null
  }
  spinning.value = true
  showEmpty.value = false
  refreshSpinning()

  modelRef.value.pageSize = pageRef.pageSize
  if (isEmpty(modelRef.value.value)) modelRef.value.value = null //空字段查询会异常
  //是否是全量搜索（初始化、刷新）
  if (init) {
    pageRef.pageIndex = 1
    modelRef.value.value = null
    modelRef.value.pageIndex = 1
  } else {
    //是否是搜索框搜索（需回到第一页）
    if (search) {
      pageRef.pageIndex = 1
      modelRef.value.pageIndex = 1
    }
    modelRef.value.pageIndex = pageRef.pageIndex
  }

  getCommonGroupItemsListByPage(modelRef.value).then(res => {
    if (res.data.success) {
      let itemsRows = res.data.result.rows
      pageRef.groupItemsCount = res.data.result.count
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
              itemObj.isCommon = row.isCommon != null
              itemObj.groupId = row.groupId
            }
            if (isEqual(row.type, itemType.value.icon)) {
              itemObj.iconUrl = row.value
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

/*查询*/
const onSearch = (value) => {
  modelRef.value.value = value
  searchItemsByPage(false, true)
}

/*组项类型*/
const itemType = ref()

onMounted(async () => {
  await searchItemsByPage(true)
  itemType.value = (await getItemTypeEnum()).data.result
})

const setItemVisible = (value) => {
  itemInfoModalRef.visible = value
}

</script>

<template>
  <!--  顶部按钮栏 -->
  <a-layout-header id="tool-header">
    <a-space style="gap: 4px">
      <!--搜索框-->
      <SearchInput @onSearch="onSearch"/>
    </a-space>
    <!--右侧-->
    <a-space style="float: right">
      <!--刷新-->
      <a-button class="tool-btn" type="text" size="large" @click="searchItemsByPage(true)">
        <reload-outlined class="icon" :spin="refreshSpin"/>
      </a-button>
      <a-button class="tool-btn" type="text" size="large">
        <MoreOutlined class="icon"/>
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
      <a-pagination v-if="groupItemsList.length>0" class="pagination" v-model:current="pageRef.pageIndex"
                    :default-page-size="pageRef.pageSize" :total="pageRef.groupItemsCount"
                    show-less-items @change="searchItemsByPage(false)"/>
      <a-empty v-show="showEmpty" :image="empty" :image-style="{height: '60px'}">
        <template #description>
          <p style="color:rgb(145 145 145);">这里什么都没有...</p>
        </template>
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
</style>
