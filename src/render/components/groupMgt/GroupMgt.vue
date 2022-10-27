<script setup lang="ts">
import {useRoute} from 'vue-router'
import {createVNode, h, nextTick, onMounted, onUnmounted, reactive, ref, watch} from 'vue'
import {
  MoreOutlined,
  PlusOutlined,
  ReloadOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import {deleteGroupById, getGroupListByUserInfoByPage} from "@render/api/group.api";
import {useRouter} from "vue-router";
import {store} from "@render/store";
import SaveGroupModal from "@render/components/groupMgt/SaveGroupModal.vue";
import UpdateGroupModal from "@render/components/groupMgt/UpdateGroupModal.vue";
import {Button, message, Modal, notification} from "ant-design-vue";
import empty from '@render/assets/img/empty.png'
import LoginModal from "@render/components/common/LoginModal.vue";
import SearchInput from "@render/components/common/SearchInput.vue";
import {cloneDeep} from "lodash-es";

//路由
const route = useRoute()
const router = useRouter()
// 菜单key
const menuKey = ref<string>('100')

watch(() => route.params.key, (newValue) => {
  menuKey.value = (newValue as string) // 断言推断，类型选择
})
//是否显示新增弹窗
const saveModalVisible = ref<boolean>(false)
//是否显示更新弹窗
const updateModal = reactive({
  /*传入更新弹出框的model*/
  model: {
    id: '',
    name: '',
    description: ''
  },
  visible: false
})
//当前页数
let pageIndex = ref<number>(1)
//每页总数
let pageSize = ref<number>(9)
//分组总数
let groupTotal = ref<number>()
//从后端传过来的分组数据
let groupList = ref([])
//搜索提交表单
let searchModelRef = reactive({
  userId: null,
  name: '',
  pageIndex: pageIndex.value,
  pageSize: pageSize.value
})
//加载效果是否显示
let spinning = ref(false)
//空状态显示
let showEmpty = ref<boolean>(false)
//登录弹框显示
const loginModalVisible = ref(false)
//region emit
//emit:是否显示新增弹出框，一般用于弹出框关闭时回调
const setSaveModalVisible = (value) => {
  saveModalVisible.value = value
}
//emit:是否显示更新弹出框
const setUpdateModalVisible = (value) => {
  updateModal.visible = value
}
//emit:是否显示登录弹出框
const setLoginModalVisible = (value) => {
  loginModalVisible.value = value
}
//endregion

// click:显示新增密码组弹出框
const showSaveModal = () => {
  if (store.isLogin)
    saveModalVisible.value = true
}

//click: 显示编辑密码组弹出框
const showUpdateModal = (group) => {
  updateModal.model = cloneDeep(group)
  updateModal.visible = true
}

//enter:查询
const searchGroupByPage = async (init: boolean, search?: true) => {
  if (!store.isLogin) {
    spinning.value = false
    showEmpty.value = true
    return null
  }

  spinning.value = true

  //是否是全量搜索（初始化、刷新）
  if (init) {
    pageIndex.value = 1
    searchModelRef.name = ''
    searchModelRef.pageIndex = 1
  } else {
    //是否是搜索框搜索（需回到第一页）
    if (search) {
      pageIndex.value = 1
      searchModelRef.pageIndex = 1
    }
    searchModelRef.pageIndex = pageIndex.value
  }

  searchModelRef.pageSize = pageSize.value
  searchModelRef.userId = store.user.id
  getGroupListByUserInfoByPage(searchModelRef).then((res) => {
    if (res.data.success) {
      groupTotal.value = res.data.result.count
      groupList.value = res.data.result.rows
      showEmpty.value = groupList.value.length <= 0;
    } else {
      message.error(res.data.message)
    }
  }).then(() => {
    spinning.value = false
  })
}

//router: 跳转到组项页面
const showGroupItem = (id: string, name: string) => {
  store.currentGroupId = id
  store.currentGroupName = name
  router.push({name: 'groupItems'})
}

//删除
const onDelete = (id: string) => {
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: '确认删除当前密码组？',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      //删除密码组
      deleteGroupById(id).then(res => {
        if (res.data.success) {
          message.success("删除成功！")
          searchGroupByPage(true)
        } else
          message.error(res.data.message)
      })
    },
  });
}

/*注册提醒*/
const notificationKey = `open${Date.now()}`;
const openUnLoginNotification = () => {
  notification.open({
    message: '提醒',
    description:
        '当前为跨平台模式但未登录，是否前往登录？',
    placement: "bottomRight",
    btn: () =>
        h(
            Button,
            {
              type: 'primary',
              size: 'small',
              onClick: () => {
                //store.selectedMenuKeys = ['500']
                //router.push({name: 'settings'})
                loginModalVisible.value = true
                notification.close(notificationKey)
              },
            },
            {default: () => '登录'},
        ),
    key: notificationKey,
  });
};

onMounted(async () => {
  if (!store.isLogin)
    openUnLoginNotification()
  await searchGroupByPage(true)
})

onUnmounted(() => {
  notification.close(notificationKey)
})

/*查询*/
const onSearch = (value) => {
  searchModelRef.name = value
  searchGroupByPage(false, true)
}

</script>

<template>
  <!--  顶部按钮栏 -->
  <a-layout-header id="tool-header">
    <a-space style="gap: 4px">
      <!--新增弹出框 -->
      <a-button class="tool-btn" type="text" size="large" @click="showSaveModal">
        <PlusOutlined class="icon"/>
      </a-button>
      <!--搜索框-->
      <SearchInput @onSearch="onSearch"/>
    </a-space>
    <!--右侧-->
    <a-space style="float: right">
      <a-button class="tool-btn" type="text" size="large" @click="searchGroupByPage(true)">
        <reload-outlined class="icon"/>
      </a-button>
      <a-button class="tool-btn" type="text" size="large">
        <MoreOutlined class="icon"/>
      </a-button>
    </a-space>
  </a-layout-header>
  <!--组-->
  <a-layout-content id="content-view">
    <a-spin :spinning="spinning">
      <a-row :gutter="16">
        <a-col v-for="(item) in groupList" :span="8" style="margin-bottom: 15px">
          <a-card :bordered="false" :hoverable="true" size="small">
            <a-card-meta :title="item.name" :description="item.description!=null?item.description:'暂无'"
                         :data-id="item.id"
                         :data-name="item.name" @click="showGroupItem(item.id,item.name)"/>
            <template #actions>
              <edit-outlined @click="showUpdateModal(item)"/>
              <delete-outlined @click="onDelete(item.id)"/>
              <!--<setting-outlined/>-->
            </template>
          </a-card>
        </a-col>
      </a-row>
      <a-pagination class="pagination" v-if="store.isLogin && !showEmpty" v-model:current="pageIndex"
                    :default-page-size="pageSize"
                    :total="groupTotal"
                    show-less-items @change="searchGroupByPage(false)"/>
    </a-spin>
    <a-empty v-show="showEmpty" :image="empty" :image-style="{height: '60px'}">
      <template #description>
      </template>
      <a-button type="primary" v-if="store.isLogin" @click="showSaveModal">创建</a-button>
    </a-empty>
  </a-layout-content>

  <!--  新增密码组弹框-->
  <SaveGroupModal :visible="saveModalVisible" @setVisible="setSaveModalVisible"
                  @updateTable="searchGroupByPage(true)"/>
  <!--  更新密码组弹框-->
  <UpdateGroupModal :visible="updateModal.visible" :model="updateModal.model" @setVisible="setUpdateModalVisible"
                    @updateTable="searchGroupByPage(true)"/>
  <!--登录弹框-->
  <LoginModal :visible="loginModalVisible" @setVisible="setLoginModalVisible" @updateTable="searchGroupByPage(true)"/>
</template>

<style scoped lang="less">
@import "ant-design-vue/dist/antd.variable.less";

#tool-header {
  :deep(.tool-btn):hover {
    background-color: @primary-1;
  }
}

</style>
