<script setup lang="ts">
import {useRoute} from 'vue-router'
import {computed, createVNode, h, onMounted, onUnmounted, reactive, ref, watch} from 'vue'
import {
  MoreOutlined,
  PlusOutlined,
  ReloadOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
  CheckOutlined,
  LoadingOutlined,
  MenuOutlined,
  DragOutlined,
  DownloadOutlined,
  FolderOutlined
} from '@ant-design/icons-vue'
import {
  deleteGroupById, exportByGroupIds, getGroupListByUserInfo,
  getGroupListByUserInfoByPage,
  saveGroup,
  saveOrUpdateGroup,
  updateGroup
} from "@render/api/group.api";
import {useRouter} from "vue-router";
import {store} from "@render/store";
import SaveGroupModal from "@render/components/groupMgt/SaveGroupModal.vue";
import {Button, message, Modal, notification} from "ant-design-vue";
import empty from '@render/assets/img/empty.png'
import LoginModal from "@render/components/common/LoginModal.vue";
import SearchInput from "@render/components/common/SearchInput.vue";
import {cloneDeep, isEqual, isNull} from "lodash-es";
import {isEmpty} from "lodash";
import {randomColor} from "@render/utils/randomColor";

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

const isSearch = computed(() => {
  return isEmpty(searchModelRef.name)
})

//加载效果是否显示
let spinning = ref(false)
//空状态显示
let showEmpty = ref<boolean>(false)
//登录弹框显示
const loginModalVisible = ref(false)
//刷新动画
let refreshSpin = ref(false)

//刷新动画
const refreshSpinning = () => {
  refreshSpin.value = true
  setTimeout(() => {
    refreshSpin.value = false
  }, 1000)
}

//enter:查询
const searchGroupByPage = async (init: boolean, search?: true) => {
  if (!store.isLogin) {
    spinning.value = false
    showEmpty.value = true
    return null
  }
  refreshSpinning()
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
      res.data.result.rows.forEach(item => {
        item.isEdit = false
        item.isSubmit = false
        item.avatarColor = item.avatarColor == null ? randomColor() : item.avatarColor
      })
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
const showGroupItem = (id: string, name: string, isEdit: boolean) => {
  if (!isEdit) {
    store.currentGroupId = id
    store.currentGroupName = name
    router.push({name: 'groupItems'})
  }
}

//删除
const onDelete = (id: string) => {
  if (isNull(id)) {
    searchGroupByPage(true)
  } else {
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
}

onMounted(async () => {
  await searchGroupByPage(true)
})

/*查询*/
const onSearch = (value) => {
  searchModelRef.name = value
  searchGroupByPage(false, true)
}

/*编辑*/
const onGroupEdit = (groupId: string) => {
  let group = groupList.value.filter(item => item.id === groupId).at(0)
  group.isEdit = true
}

/*提交更新*/
const onUpdateGroup = (groupId: string) => {
  let group = groupList.value.filter(item => item.id === groupId).at(0)
  let error = null
  //校验
  if (isEmpty(group.name)) {
    error = '组名不能为空!'
  } /*else if (new RegExp(
      "[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]"
  ).test(group.name)) {
    error = '组名不能包含特殊字符和空格!'
  } else if (new RegExp(
      "[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]"
  ).test(group.description)) {
    error = '备注不能包含特殊字符和空格!'
  }*/

  if (error != null) {
    message.error(error)
  } else {
    //loading
    group.isSubmit = true
    group.isEdit = false

    if (group.isTemp) {
      group.groupIndex = groupList.value.length + 1
      saveGroup(group).then(res => {
        if (res.data.success) {
          message.success(res.data.message)
        } else {
          message.error(res.data.message)
        }
      }).then(() => {
        searchGroupByPage(true)
      })
    } else {
      updateGroup(group).then(res => {
        if (res.data.success) {
          //message.success(res.data.message)
        } else {
          message.error(res.data.message)
        }

      })
    }
    group.isSubmit = false
  }
}

/*新增*/
const onAddGroup = () => {
  if (store.isLogin) {
    showEmpty.value = false
    //有临时表单卡片不可再次新增
    if (groupList.value.filter(item => item.isTemp == true).length > 0) {
      message.warn('每次只可添加一个')
    } else {
      const emptyGroup = {
        id: null,
        name: '',
        description: '',
        userId: store.user.id,
        isEdit: true,
        isSubmit: false,
        isTemp: true
      }
      groupList.value.unshift(emptyGroup)
      groupList.value = cloneDeep(groupList.value.slice(0, pageSize.value))
    }
  } else
    message.warn('尚未登录')
}

const exportGroupRef = reactive({
  modalVisible: false,
  checkedGroupList: [],
  groupList: [],/*待选列表*/
  isCheckedAll: false,
  loading:false
})

const onShowExportModal = async () => {
  exportGroupRef.modalVisible = true
  exportGroupRef.groupList = (await getGroupListByUserInfo({id: store.user.id})).data.result
  exportGroupRef.checkedGroupList = [] /*初始化*/
}
watch(() => exportGroupRef.checkedGroupList, (value) => {
  exportGroupRef.isCheckedAll = isEqual(value.length, exportGroupRef.groupList.length);/*是否全选*/
})

const onCheckedAll = () => {
  exportGroupRef.checkedGroupList = cloneDeep(exportGroupRef.groupList.map(item => item.id))
}

const onUncheckedAll = () => {
  exportGroupRef.checkedGroupList = []
}

/*导出*/
const onExport = () => {
  exportGroupRef.loading = true
  exportByGroupIds(exportGroupRef.checkedGroupList, false).then(res => {
    if (res.data.success && res.data.tag == 1) {
      message.success(res.data.message)
      exportGroupRef.modalVisible = false
    } else if (!res.data.success) {
      message.error(res.data.message)
      exportGroupRef.modalVisible = false
    }
  }).then(()=>{
    exportGroupRef.loading = false
  })
}

</script>

<template>
  <!--  顶部按钮栏 -->
  <a-layout-header id="tool-header">
    <a-space style="gap: 4px">
      <!--新增弹出框 -->
      <a-button class="tool-btn" type="text" size="large" @click="onAddGroup" title="新增"><!--showSaveModal-->
        <template #icon>
          <PlusOutlined/>
        </template>
        新增
      </a-button>
      <!--搜索框-->
      <SearchInput @onSearch="onSearch"/>
    </a-space>
    <!--右侧-->
    <a-space style="float: right;gap: 4px">
      <a-button class="tool-btn" type="text" size="large" @click="searchGroupByPage(true)" title="刷新">
        <template #icon>
          <reload-outlined :spin="refreshSpin"/>
        </template>
        刷新
      </a-button>
      <a-button class="tool-btn" type="text" size="large" @click="onShowExportModal" title="导出">
        <template #icon>
          <download-outlined/>
        </template>
        导出
      </a-button>
      <!--更多-->
      <a-popover placement="bottom">
        <template #content>
        </template>
        <div class="more-btn">
          <more-outlined class="icon"/>
        </div>
      </a-popover>
    </a-space>
  </a-layout-header>
  <!--组-->
  <a-layout-content id="content-view">
    <a-spin :spinning="spinning">
      <a-row :gutter="16">
        <a-col v-for="(item) in groupList" :span="8"
               style="margin-bottom: 15px;max-height: 119.141px;user-select: none;">
          <a-card :bordered="false" :hoverable="true" size="small" class="animate__animated animate__flipInX">
            <a-card-meta :data-id="item.id" :data-name="item.name"
                         @click="showGroupItem(item.id,item.name,item.isEdit)">
              <template #title>
                <div class="card-title-space" v-show="!item.isEdit">
                  <span>{{ item.name }}</span>
                </div>
                <a-input v-show="item.isEdit" :bordered="true" placeholder="请输入组名..." class="card-input"
                         maxlength="10"
                         v-model:value="item.name"/>
              </template>
              <template #description>
                <a-space class="card-desc-space" v-show="!item.isEdit">
                  <span>{{ isEmpty(item.description) ? '暂无' : item.description }}</span>
                </a-space>
                <a-input v-show="item.isEdit" :bordered="true" placeholder="请输入描述..." class="card-input"
                         maxlength="10"
                         v-model:value="item.description"/>
              </template>
              <template #avatar>
                <a-avatar
                    shape="square"
                    size="large"
                    :style="{ backgroundColor:item.avatarColor , verticalAlign: 'middle' }"
                >
                  {{ item.name }}
                </a-avatar>
              </template>
            </a-card-meta>
            <template #actions>
              <loading-outlined v-if="!item.isEdit && item.isSubmit"/>
              <check-outlined class="animate__animated animate__flipInX" v-if="item.isEdit"
                              @click="onUpdateGroup(item.id)"/>
              <edit-outlined v-if="!item.isEdit && !item.isSubmit" @click="onGroupEdit(item.id)"/>
              <delete-outlined @click="onDelete(item.id)"/>
              <a-popover trigger="click" placement="bottom" class="popover-menu">
                <template #content>
                  <a-button type="text">更改图标</a-button>
                </template>
                <menu-outlined/>
              </a-popover>
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
      <a-button type="primary" v-if="store.isLogin && isSearch" @click="onAddGroup">创建</a-button>
    </a-empty>
  </a-layout-content>

  <a-modal v-model:visible="exportGroupRef.modalVisible"
           width="50%"
           height="318px"
           title="导出"
           :closable="true"
           ok-text="导出至"
           cancel-text="取消"
           @ok=""
           @cancel=""
  >
    <div style="max-height: 245px;overflow-y: auto;">
      <a-checkbox-group v-model:value="exportGroupRef.checkedGroupList">
        <a-row v-for="group in exportGroupRef.groupList" style="margin-bottom: 4px;width: 385px;">
          <a-col style="width: 100%" :class="group.isSelected?'':'group-col'" @click="">
            <div style="width: 100%;height: 48px;cursor: pointer"
                 :class="group.isSelected?'selected':'unSelected'">
              <a-space align="center" style="height: 100%;padding-left: 5px;">
                <folder-outlined style="font-size: 24px;"/>
                {{ group.name }}
                <a-checkbox :value="group.id" style="margin-left: 285px;"></a-checkbox>
              </a-space>
            </div>
          </a-col>
        </a-row>
      </a-checkbox-group>
    </div>

    <template #footer>
      <a-button v-if="!exportGroupRef.isCheckedAll" style="float: left" @click="onCheckedAll">全选</a-button>
      <a-button v-if="exportGroupRef.isCheckedAll" style="float: left" @click="onUncheckedAll">取消全选</a-button>
      <a-button @click="exportGroupRef.modalVisible = false">取消</a-button>
      <a-button type="primary" :disabled="isNull(exportGroupRef.checkedGroupList)" @click="onExport" :loading="exportGroupRef.loading">导出至</a-button>
    </template>
  </a-modal>
</template>

<style scoped lang="less">
@import "ant-design-vue/dist/antd.variable.less";

#tool-header {
  :deep(.tool-btn):hover {
    background-color: @primary-1;
  }
}

#content-view {
  .card-title-space {
    gap: 0;
    max-width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .card-title-btn {
    float: right;
    padding-right: 0;
  }

  .card-desc-space {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 200px;
  }

  .card-input {
    max-width: 100%;
    padding: 0;
    margin-bottom: 0
  }
}

.more-btn {
  :hover {
    background-color: @primary-1;
  }

  height: 40px;
  width: 32px;
  cursor: pointer;

  .icon {
    font-size: 16px;
    padding: 10px 5px 8px 5px;
  }


}

#content-view {
  overflow: hidden;
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

<style>
.ant-popover-inner-content {
  padding: 4px;
}
</style>
