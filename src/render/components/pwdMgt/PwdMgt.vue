<script setup lang="ts">
import {useRoute} from 'vue-router'
import {onMounted, reactive, ref, toRaw, watch} from 'vue'
import {MoreOutlined, PlusOutlined, ReloadOutlined} from '@ant-design/icons-vue'
import {getPwdGroupListByUserInfo} from "@render/api/pwdMgt/pwdMgt.api";
import {getIpcResponseData} from '@common/types'
import AddGroupModal from '@render/components/pwdMgt/AddGroupModal.vue'

const route = useRoute()

// 菜单key
const menuKey = ref<string>('100')
watch(() => route.params.key, (newValue) => {
  menuKey.value = (newValue as string) // 断言推断，类型选择
})

//是否显示新增弹窗
let visible = ref<boolean>(false)

// 显示弹出框
const showAddCardModal = () => {
  visible.value = true
}

const setVisible = (value) => {
  visible.value = value
}


//从后端传过来的分组数据
let pwdGroupArr = ref([])

onMounted(() => {
  updateGroupGrid(true);
})

const updateGroupGrid = async (value) => {
  if (value)
    pwdGroupArr.value = getIpcResponseData((await getPwdGroupListByUserInfo({})).data);
}

</script>

<template>
  <!--  顶部按钮栏 -->
  <a-layout-header id="tool-header">
    <!-- 弹出框 -->
    <a-button class="tool-btn" type="text" size="large" @click="showAddCardModal">
      <PlusOutlined class="icon"/>
    </a-button>

    <div style="float: right">
      <a-button class="tool-btn" type="text" size="large" @click="updateGroupGrid">
        <reload-outlined class="icon"/>
      </a-button>
      <a-button class="tool-btn" type="text" size="large">
        <MoreOutlined class="icon"/>
      </a-button>
    </div>
  </a-layout-header>
  <AddGroupModal :visible="visible" @getVisible="setVisible" @createGroup="updateGroupGrid"/>
  <a-layout-content id="card-view">
    <div style="padding: 20px">
      <a-row :gutter="16">
        <a-col v-for="(item) in pwdGroupArr" :span="8" style="margin-bottom: 15px">
          <a-card :title="item.name" :data-id="item.id" :bordered="false" :hoverable="true" size="small" head-style="">
            <template #extra>
              <a-button class="card-extra-btn" type="link">
                <MoreOutlined/>
              </a-button>
            </template>
            <p>card content</p>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </a-layout-content>
</template>

<style scoped lang="less">
#tool-header {
  background: #fff;
  margin: 8px;
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
}
</style>

<style>
.card-extra-btn {
  padding-right: 0;
}
</style>
