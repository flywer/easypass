<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, reactive, ref, watch } from 'vue'
import { MoreOutlined, PlusOutlined } from '@ant-design/icons-vue'
import AddGroupModal from './addGroupModal.vue'

const route = useRoute()

// 菜单key
const menuKey = ref<string>('100')
watch(() => route.params.key, (newValue) => {
  menuKey.value = (newValue as string) // 断言推断，类型选择
})

const visible = ref<boolean>(false)

// 显示弹出框
const showAddCardModal = () => {
  visible.value = true
}

const setVisible = (value) => {
  visible.value = value
}

const defaultGroupItem = reactive({
  name: '默认',
})

const groupList = reactive([])

onMounted(() => {
  groupList.push(defaultGroupItem)
})

const setGroupName = (value) => {
  groupList.push(reactive({ name: value }))
}
</script>

<template>
  <!--  顶部按钮栏 -->
  <a-layout-header id="toolHeader" class="card">
    <!-- 弹出框 -->
    <a-button type="text" size="large" @click="showAddCardModal">
      <PlusOutlined class="icon" />
    </a-button>
    <AddGroupModal :visible="visible" @getVisible="setVisible" @getGroupName="setGroupName" />

    <a-button type="text" size="large" style="float: right">
      <MoreOutlined class="icon" />
    </a-button>
  </a-layout-header>

  <a-layout-content id="cardView">
    <div style="padding: 20px">
      <a-row :gutter="16">
        <a-col v-for="(item) in groupList" :span="8" style="margin-bottom: 15px">
          <a-card :title="item.name" :bordered="false" :hoverable="true" size="small" head-style="">
            <template #extra>
              <a-button type="link" style="padding-right: 0;">
                <MoreOutlined />
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
#toolHeader {
  background: #fff;
  margin: 8px;
  -webkit-border-radius: 5px;
  height: auto;
  line-height: normal;
  padding: 2px;

  .icon {
    font-size: 20px;
    color: #545454;
  }
}

#cardView {
  margin: 0 8px;
  background-color: #ececec;
}
</style>
