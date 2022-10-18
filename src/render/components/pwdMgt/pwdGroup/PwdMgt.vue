<script setup lang="ts">
import {useRoute} from 'vue-router'
import {createVNode, nextTick, onMounted, reactive, ref, watch} from 'vue'
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
import {message, Modal} from "ant-design-vue";
import {getNetworkInterfaces} from "@render/api/app.api";
import {getMacExist} from "@render/api/user.api";

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
  name: '',
  pageIndex: pageIndex.value,
  pageSize: pageSize.value
})
//加载效果是否显示
let spinning = ref(true)
//传入弹框的组ID，没有则为新建
//let modalGroupId = ref()

let modalRef = ref({
  id: '',
  name: '',
  description: ''
})
//region emit
//emit:是否显示新增弹出框，一般用于弹出框关闭时回调
const setSaveModalVisible = (value) => {
  saveModalVisible.value = value
}
//emit:是否显示更新弹出框
const setUpdateModalVisible = (value) => {
  updateModalVisible.value = value
}

//endregion

//region click

// click:显示新增密码组弹出框
const showSaveModal = () => {
  saveModalVisible.value = true
}

//click: 显示编辑密码组弹出框
const showUpdateModal = (group) => {
  modalRef.value = group
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

onMounted(async () => {
  await searchGroupByPage(true)
  setInterval(() => {
    if (blur && searchInputVisible.value)
      searchInputVisible.value = false
  }, 600)

})

// blur:搜索框失去焦点时触发
const searchInputBlur = () => {
  blur = true
}

//enter:搜索
const searchGroupByPage = async (init: boolean, search?: true) => {
  let checkUser = (await getMacExist()).data.result
  if (checkUser.id != null) {
    store.isLogin = true
    store.userId = checkUser.id
    store.mac = checkUser.mac
    spinning.value = false
  } else {
    store.isLogin = false
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
  pageVo.rows.forEach(item => {
    pwdGroupList.value.push(item.dataValues)
  })
}

//router: 跳转到组项页面
const showGroupItem = (id: string, name: string) => {
  store.currentGroupId = id
  store.currentGroupName = name
  router.push({name: 'groupItems'})
}

const handleDelete = (id: string) => {
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: '确认删除当前密码组？',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      deleteGroupItem(id)
    },
  });
}

//删除密码组
const deleteGroupItem = (id: string) => {
  deleteGroupById(id).then(res => {
    if (res.data.success) {
      message.success("删除成功！")
      searchGroupByPage(true)
    } else
      message.error(res.data.message)
  })
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
              <delete-outlined @click="handleDelete(item.id)"/>
              <!--<setting-outlined/>-->
            </template>
          </a-card>
        </a-col>
      </a-row>
      <a-pagination class="pagination" v-model:current="pageIndex" :default-page-size="pageSize" :total="groupTotal"
                    show-less-items @change="searchGroupByPage(false)"/>
    </a-spin>
  </a-layout-content>
  <!--  新增密码组弹框-->
  <SaveGroupModal :visible="saveModalVisible" @setVisible="setSaveModalVisible"
                  @updateTable="searchGroupByPage(true)"/>
  <!--  更新密码组弹框-->
  <UpdateGroupModal :visible="updateModalVisible" :modalRef="modalRef" @setVisible="setUpdateModalVisible"
                    @updateTable="searchGroupByPage(true)"/>

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
