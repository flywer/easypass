<script setup lang="ts">
import {useRoute} from 'vue-router'
import {nextTick, onMounted, reactive, ref, toRaw, watch} from 'vue'
import {MoreOutlined, PlusOutlined, ReloadOutlined, SearchOutlined} from '@ant-design/icons-vue'
import {getPwdGroupListByUserInfo, getPwdGroupListByUserInfoByPage} from "@render/api/pwdMgt/pwdMgt.api";
import {getIpcResponseData} from '@common/types'
import AddGroupModal from '@render/components/pwdMgt/AddGroupModal.vue'
import {useRouter} from "vue-router";
import {store} from "@render/store";

//路由
const route = useRoute()
const router = useRouter()
// 菜单key
const menuKey = ref<string>('100')
watch(() => route.params.key, (newValue) => {
  menuKey.value = (newValue as string) // 断言推断，类型选择
})
//是否显示新增弹窗
let visible = ref<boolean>(false)
//当前页数
let pageIndex = ref<number>(1)
//每页总数
let pageSize = ref<number>(9)
//分组总数
let groupTotal = ref<number>()
//从后端传过来的分组数据
let pwdGroupArr = ref([])
//搜索框显示
let searchInputVisible = ref<boolean>(false)
//搜索框是否失去焦点
let blur = true
//搜索提交表单
let modelRef = reactive({
  name: '',
  pageIndex: pageIndex.value,
  pageSize: pageSize.value
})

//region emit
//emit:是否显示弹出框，一般用于弹出框关闭时回调
const setVisible = (value) => {
  visible.value = value
}

//endregion

//region click

// click:显示弹出框
const showAddCardModal = () => {
  visible.value = true
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

onMounted(() => {
  searchGroupByPage(true)
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
  modelRef.pageSize = pageSize.value
  let pageVo: { count: number; rows: any[] }
  //是否是全量搜索（初始化、刷新）
  if (init) {
    pageIndex.value = 1
    modelRef.name = ''
    modelRef.pageIndex = 1
  } else {
    //是否是搜索框搜索（需回到第一页）
    if (search) {
      pageIndex.value = 1
      modelRef.pageIndex = 1
    }
    modelRef.pageIndex = pageIndex.value
  }
  pageVo = (await getPwdGroupListByUserInfoByPage(modelRef)).data
  groupTotal.value = pageVo.count
  pwdGroupArr.value = []
  pageVo.rows.forEach(item => {
    pwdGroupArr.value.push(item.dataValues)
  })
}

//router: 跳转到组项页面
const showGroupItem = (event) => {
  store.currentGroupId = event.currentTarget.dataset.id
  store.currentGroupName = event.currentTarget.dataset.name
  router.push({name: 'groupItems'})
}

</script>

<template>
  <!--  顶部按钮栏 -->
  <a-layout-header id="tool-header">
    <a-space>
      <!--新增弹出框 -->
      <a-button class="tool-btn" type="text" size="large" @click="showAddCardModal">
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
              v-model:value="modelRef.name"
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
  <!--  新增弹框-->
  <AddGroupModal :visible="visible" @getVisible="setVisible" @createGroup="searchGroupByPage(true)"/>
  <!--组-->
  <a-layout-content id="card-view">
    <a-row :gutter="16">
      <a-col v-for="(item) in pwdGroupArr" :span="8" style="margin-bottom: 15px">
        <a-card :title="item.name" :data-id="item.id" :data-name="item.name" :bordered="false" :hoverable="true" size="small" head-style=""
                @click="showGroupItem($event)">
          <template #extra>
            <a-button class="card-extra-btn" type="link">
              <MoreOutlined/>
            </a-button>
          </template>
          <p>card content</p>
        </a-card>
      </a-col>
    </a-row>
    <a-pagination class="pagination" v-model:current="pageIndex" :default-page-size="pageSize" :total="groupTotal"
                  show-less-items @change="searchGroupByPage(false)"/>
  </a-layout-content>
</template>

<style scoped lang="less">
#tool-header {
  background: #fff;
  margin: 40px 8px 8px 8px;
  -webkit-border-radius: 5px;
  height: auto;
  line-height: normal;
  padding: 2px 8px 2px 8px;

  .icon {
    font-size: 20px;
    color: #545454;
  }

  .tool-btn {
    padding: 0 2px;
  }

}

#card-view {
  margin: 0 8px;
  background-color: #ececec;
  padding: 20px 20px 10px 20px;
  min-height: auto;

  .pagination {
    text-align: center;
    bottom: 10px;
  }
}


@keyframes searchWith {
  from {
    width: 0;
  }
  to {
    width: 120px;
  }
}

.search-enter-active {
  animation: searchWith 0.5s;
}

.search-leave-active {
  animation: searchWith 0.5s reverse;
}

</style>

<style>
.card-extra-btn {
  padding-right: 0;
}
</style>
