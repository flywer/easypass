<!--组项列表-->
<script setup lang="ts">
import {store} from "@render/store";
import {useRouter} from "vue-router";
import {createVNode, nextTick, onMounted, ref} from "vue";
import {
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
  TableOutlined,
  CopyOutlined,
  DeleteOutlined, ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import {deleteGroupItemByItemId, getGroupItemsListByPage, getItemsListByItemId} from "@render/api/groupItem.api";
import empty from '@render/assets/img/empty.png'
import {copyText} from "@render/utils/clipboard";
import {message, Modal} from "ant-design-vue";
import ItemsInfoModal from "@render/components/pwdMgt/groupItem/ItemsInfoModal.vue";

const router = useRouter()
//从后端传过来的分组数据
let groupItemsList = ref([])
//当前页数
let pageIndex = ref<number>(1)
//每页总数
let pageSize = ref<number>(6)
//分组总数
let groupItemsCount = ref<number>()
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
//刷新动画
let refreshSpin = ref(false)
//是否显示组详情
const itemInfoModalVisible = ref(false)
//详情页信息
const itemInfoModelRef = ref([])
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
  router.push({name: 'groupItemTableForm'})
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

  getGroupItemsListByPage(modelRef.value).then(res => {
    if (res.data.success) {
      let itemsRows = res.data.result.rows
      groupItemsCount.value = res.data.result.count.length
      groupItemsList.value = []
      if (itemsRows.length > 0)
        itemsRows.forEach(arr => {
          let itemObj = {itemId: null, title: '暂无', account: '', showItems: []}
          //每个组里有多个项，提取每个
          arr.forEach(row => {
            if (row.isTitle) {
              itemObj.itemId = row.itemId
              itemObj.title = row.value
            }
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

//router:返回密码组管理页面
const backToPwdMgt = () => {
  store.currentGroupId = null
  store.currentGroupName = null
  router.back()
}

const showUpdateModal = (itemId: string) => {
  router.push(
      {
        name: 'groupItemTableForm',
        query: {itemId: itemId}
      }
  )
}

//查看
const showAccountItems = async (itemId: string) => {
  await getItemsListByItemId(itemId).then(res => {
    if (res.data.success) {
      let model = []
      res.data.result.forEach(item => {
        model.push(item)
      })
      itemInfoModelRef.value = model
      itemInfoModalVisible.value = true
    } else {
      message.error(res.data.message)
    }
  }).catch(e => {
    console.error(e)
  })
}

const handleDelete = (itemId: string) => {
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: '确认删除当前组？',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      deleteGroupItem(itemId)
    },
  });
}

//删除账号组
const deleteGroupItem = (itemId: string) => {
  deleteGroupItemByItemId(itemId).then(res => {
    if (res.data.success) {
      message.success("删除成功！")
      searchItemsByPage(true)
    } else
      message.error(res.data.message)
  })
}

</script>

<template>

  <!--  顶部按钮栏 -->
  <a-layout-header id="tool-header">
    <a-space style="gap: 4px">
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
    <!--新增-->
    <AddItemModal :addItemModalVisible="addItemModalVisible" @getVisible="setVisible"
                  @createGroup="searchItemsByPage(true)"/>
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
          <a-card :data-id="item.itemId" :bordered="false" :hoverable="true"
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
              <a-space :size="10">
                <a-divider type="vertical" style="background-color: #f0f0f0"/>
                <a-button type="text" class="card-extra-btn" title="详情">
                  <table-outlined @click="showAccountItems(item.itemId)"/>
                </a-button>

                <a-button type="text" class="card-extra-btn" title="编辑">
                  <edit-outlined @click="showUpdateModal(item.itemId)"/>
                </a-button>

                <a-button type="text" class="card-extra-btn" title="删除">
                  <delete-outlined @click="handleDelete(item.itemId)"/>
                </a-button>
              </a-space>
            </template>
          </a-card>
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
    <ItemsInfoModal :visible="itemInfoModalVisible" :model="itemInfoModelRef"/>
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
  padding: 0;
}
</style>
