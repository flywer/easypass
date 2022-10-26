<!--常用账号-->
<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {copyText} from "@render/utils/clipboard";
import empty from '@render/assets/img/empty.png'
import {
  MoreOutlined,
  ReloadOutlined,
  SearchOutlined,
  CopyOutlined,
} from '@ant-design/icons-vue'
import {getCommonGroupItemsListByPage} from "@render/api/groupItem.api";
import {message} from "ant-design-vue";
import ItemCardExtra from "@render/components/pwdMgt/groupItem/ItemCardExtra.vue";
import ItemsInfoModal from "@render/components/pwdMgt/groupItem/ItemsInfoModal.vue";
import SearchInput from "@render/components/base/SearchInput.vue";

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
  pageSize: pageRef.pageSize
});
//
const itemInfoModalRef = reactive({
  model: null,/*详情页信息*/
  visible: null/*是否显示组详情*/
})

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
  spinning.value = true
  showEmpty.value = false
  refreshSpinning()

  modelRef.value.pageSize = pageRef.pageSize

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
      pageRef.groupItemsCount = res.data.result.count.length
      groupItemsList.value = []
      if (itemsRows.length > 0)
        itemsRows.forEach(arr => {
          let itemObj = {itemId: null, title: '暂无', account: '', showItems: [], isCommon: false, groupId: null}
          //每个组里有多个项，提取每个
          arr.forEach(row => {
            /*标题*/
            if (row.isTitle) {
              itemObj.itemId = row.itemId
              itemObj.title = row.value
              itemObj.isCommon = row.isCommon != null
              itemObj.groupId = row.pwdGroupId
            }
            /*主账号*/
            if (row.isAccount) {
              itemObj.account = row.value
            }
            /*展示出来的组项*/
            if (row.isShow && !row.isTitle) {
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
const onSearch = (value)=>{
  modelRef.value.value=value
  searchItemsByPage(false,true)
}

onMounted(async () => {
  await searchItemsByPage(true)
})

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
          <a-card :data-id="item.itemId"
                  :bordered="false"
                  :hoverable="true"
                  size="small"
          >
            <template #title>
              <a-space>
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
    <ItemsInfoModal :visible="itemInfoModalRef.visible" :model="itemInfoModalRef.model"/>
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
