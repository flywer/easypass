<!--组项列表-->
<script setup lang="ts">

import {store} from "@render/store";
import {useRouter} from "vue-router";
import {nextTick, onMounted, ref} from "vue";
import {MoreOutlined, PlusOutlined, ReloadOutlined, SearchOutlined, ArrowLeftOutlined} from '@ant-design/icons-vue'
import {getGroupItemsListByPage} from "@render/api/groupItem.api";

import empty from '@render/assets/img/empty.png'

const router = useRouter()
let modalVisible = ref<boolean>(false)
//从后端传过来的分组数据
let accountItemList = ref([])
//当前页数
let pageIndex = ref<number>(1)
//每页总数
let pageSize = ref<number>(9)
//分组总数
let itemTotal = ref<number>()
//搜索框显示
let searchInputVisible = ref<boolean>(false)
//搜索框是否失去焦点
let blur = true
//查询model
let modelRef = ref({
  value: '',
  groupId: store.currentGroupId,
  pageIndex: pageIndex.value,
  pageSize: pageSize.value
});
//组信息model
let groupModelRef = ref({
  name: store.currentGroupName,
  id: store.currentGroupId
})
//是否显示新增弹窗
let addItemModalVisible = ref<boolean>(false)
//加载效果是否显示
let spinning = ref(true)
//空状态显示
let showEmpty = ref<boolean>(false)

onMounted(async () => {
  await searchItemsByPage(true)
  setInterval(() => {
    if (blur && searchInputVisible.value)
      searchInputVisible.value = false
  }, 600)
})

//region emit
//emit:是否显示弹出框，一般用于弹出框关闭时回调
const setVisible = (value) => {
  addItemModalVisible.value = value
}

//endregion

// click:显示添加账号项
const showAddItemModal = () => {
  //addItemModalVisible.value = true
  router.push({name: 'commonPassword'})
}

// click:搜索框显示
const showSearchInput = () => {
  if (!searchInputVisible.value) {
    searchInputVisible.value = true
    blur = false
    nextTick(() => {
      document.getElementById("search-input").focus()
    })
  } else {
    blur = true
  }
}

// blur:搜索框失去焦点时触发
const searchInputBlur = () => {
  blur = true
}

const searchItemsByPage = async (init: boolean, search?: true) => {
  spinning.value = true

  modelRef.value.pageSize = pageSize.value
  let pageVo: { count: number; rows: any[] }
  //是否是全量搜索（初始化、刷新）
  if (init) {
    pageIndex.value = 1
    modelRef.value.value = ''
    modelRef.value.pageIndex = 1
  } else {
    //是否是搜索框搜索（需回到第一页）
    if (search) {
      pageIndex.value = 1
      modelRef.value.pageIndex = 1
    }
    modelRef.value.pageIndex = pageIndex.value
  }
  let result = await getGroupItemsListByPage(modelRef.value).then((res) => {
    spinning.value = false
    return res
  }).catch((err) => {
    spinning.value = false
    console.log('错误' + err)
    return null
  })
  pageVo = result.data
  itemTotal.value = pageVo.count
  accountItemList.value = []
  if (pageVo.rows.length > 0)
    pageVo.rows.forEach(item => {
      accountItemList.value.push(item.dataValues)
    })
  else showEmpty.value = true
}


//router:返回密码组管理页面
const backToPwdMgt = () => {
  store.currentGroupId = null
  store.currentGroupName = null
  router.back()
}

</script>

<template>

  <!--  顶部按钮栏 -->
  <a-layout-header id="tool-header">
    <a-space>
      <a-space>
        <!--返回-->
        <a-button class="tool-btn" type="text" size="large" @click="backToPwdMgt">
          <arrow-left-outlined class="icon"/>
        </a-button>
        <a-typography-title :level="5" style="margin-bottom: 2px">{{ groupModelRef.name }}</a-typography-title>
        <a-divider type="vertical" class="divider"/>
      </a-space>
      <!--新增-->
      <a-button class="tool-btn" type="text" size="large" @click="showAddItemModal">
        <PlusOutlined class="icon"/>
      </a-button>
      <!--搜索-->
      <a-button id="search-btn" class="tool-btn" type="text" size="large" @click="showSearchInput">
        <search-outlined class="icon"/>
      </a-button>
      <!--搜索框动画-->
      <transition name="search">
        <div
            v-if="searchInputVisible"
            style="width: 120px;border-bottom:1px solid #cbcbcb;">
          <a-input
              v-model:value="modelRef.value"
              id="search-input"
              :bordered="false"
              allow-clear
              :onblur="searchInputBlur"
              @keyup.enter="searchItemsByPage(false,true)"
              placeholder="回车搜索↵"
          />
        </div>

      </transition>
    </a-space>
    <!--  新增弹框-->
    <AddItemModal :addItemModalVisible="addItemModalVisible" @getVisible="setVisible"
                  @createGroup="searchItemsByPage(true)"/>
    <!--右侧-->
    <a-space style="float: right">
      <!--刷新-->
      <a-button class="tool-btn" type="text" size="large" @click="searchItemsByPage(true)">
        <reload-outlined class="icon"/>
      </a-button>
      <a-button class="tool-btn" type="text" size="large">
        <MoreOutlined class="icon"/>
      </a-button>
    </a-space>
  </a-layout-header>
  <!--账号列表-->
  <a-layout-content id="content-view">
    <a-spin :spinning="spinning">
      <a-row :gutter="16">
        <a-col v-for="(item) in accountItemList" :span="8" style="margin-bottom: 15px">
          <a-card :title="item.value" :data-id="item.itemId" :bordered="false" :hoverable="true"
                  size="small" head-style=""
                  @click="">
            <template #extra>
              <a-button class="card-extra-btn" type="link">
                <MoreOutlined/>
              </a-button>
            </template>
            <p>card content</p>
          </a-card>
        </a-col>
      </a-row>
      <a-pagination v-if="accountItemList.length>0" class="pagination" v-model:current="pageIndex"
                    :default-page-size="pageSize" :total="itemTotal"
                    show-less-items @change="searchItemsByPage(false)"/>
      <a-empty v-show="showEmpty" :image="empty" :image-style="{height: '60px',}">
        <template #description>
        </template>
        <a-button type="primary" @click="showAddItemModal">创建</a-button>
      </a-empty>

    </a-spin>
  </a-layout-content>
</template>

<style scoped lang="less">
@keyframes searchWidth {
  from {
    width: 0;
  }
  to {
    width: 120px;
  }
}

.search-enter-active {
  animation: searchWidth 0.5s;
}

.search-leave-active {
  animation: searchWidth 0.5s reverse;
}

</style>

<style>
.card-extra-btn {
  padding-right: 0;
}
</style>
