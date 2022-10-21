<script setup lang="ts">
import {useRoute} from 'vue-router'
import {createVNode, h, nextTick, onMounted, onUnmounted, reactive, ref, watch} from 'vue'
import {
  MoreOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined, ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import {deleteGroupById, getPwdGroupListByUserInfoByPage} from "@render/api/pwdMgt.api";
import {useRouter} from "vue-router";
import {store} from "@render/store";
import SaveGroupModal from "@render/components/pwdMgt/pwdGroup/SaveGroupModal.vue";
import UpdateGroupModal from "@render/components/pwdMgt/pwdGroup/UpdateGroupModal.vue";
import {Button, message, Modal, notification} from "ant-design-vue";
import empty from '@render/assets/img/empty.png'
import LoginModal from "@render/components/pwdMgt/pwdGroup/LoginModal.vue";

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
const updateModalVisible = ref<boolean>(false)
//当前页数
let pageIndex = ref<number>(1)
//每页总数
let pageSize = ref<number>(9)
//分组总数
let groupTotal = ref<number>()
//从后端传过来的分组数据
let pwdGroupList = ref([])
//搜索框显示
let searchInputVisible = ref<boolean>(false)
//搜索框是否失去焦点
let blur = true
//搜索提交表单
let searchModelRef = reactive({
  userId: null,
  name: '',
  pageIndex: pageIndex.value,
  pageSize: pageSize.value
})
//加载效果是否显示
let spinning = ref(false)
/*传入更新弹出框的model*/
let modelRef = ref({
  id: '',
  name: '',
  description: ''
})
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
  updateModalVisible.value = value
}

const setLoginModalVisible = (value) => {
  loginModalVisible.value = value
}

//endregion

//region click

// click:显示新增密码组弹出框
const showSaveModal = () => {
  if (store.isLogin)
    saveModalVisible.value = true
}

//click: 显示编辑密码组弹出框
const showUpdateModal = (group) => {
  modelRef.value = group
  updateModalVisible.value = true
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

//endregion

// blur:搜索框失去焦点时触发
const searchInputBlur = () => {
  blur = true
}

//enter:搜索
const searchGroupByPage = async (init: boolean, search?: true) => {
  if (!store.isLogin) {
    spinning.value = false
    showEmpty.value = true
    return null
  }

  spinning.value = true
  searchModelRef.pageSize = pageSize.value
  let pageVo: { count: number; rows: any[] }
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

  searchModelRef.userId = store.user.id
  let result = await getPwdGroupListByUserInfoByPage(searchModelRef).then((res) => {
    spinning.value = false
    return res
  }).catch((err) => {
    spinning.value = false
    console.log('错误' + err)
    return null
  })

  pageVo = result.data
  groupTotal.value = pageVo.count
  pwdGroupList.value = []
  if (pageVo.rows.length > 0) {
    pageVo.rows.forEach(item => {
      pwdGroupList.value.push(item.dataValues)
    })
    showEmpty.value = false
  } else
    showEmpty.value = true
}

//router: 跳转到组项页面
const showGroupItem = (id: string, name: string) => {
  store.currentGroupId = id
  store.currentGroupName = name
  router.push({name: 'groupItems'})
}

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
  setInterval(() => {
    if (blur && searchInputVisible.value)
      searchInputVisible.value = false
  }, 600)
})

onUnmounted(() => {
  notification.close(notificationKey)
})

</script>

<template>
  <!--  顶部按钮栏 -->
  <a-layout-header id="tool-header">
    <a-space style="gap: 4px">
      <!--新增弹出框 -->
      <a-button class="tool-btn" type="text" size="large" @click="showSaveModal">
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
              v-model:value="searchModelRef.name"
              id="search-input"
              :bordered="false"
              allow-clear
              :onblur="searchInputBlur"
              @keyup.enter="searchGroupByPage(false,true)"
              placeholder="回车搜索↵"
          />
        </div>
      </transition>
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
        <a-col v-for="(item) in pwdGroupList" :span="8" style="margin-bottom: 15px">
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
  <UpdateGroupModal :visible="updateModalVisible" :modalRef="modelRef" @setVisible="setUpdateModalVisible"
                    @updateTable="searchGroupByPage(true)"/>
  <!--登录弹框-->
  <LoginModal :visible="loginModalVisible" @setVisible="setLoginModalVisible" @updateTable="searchGroupByPage(true)"/>
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
