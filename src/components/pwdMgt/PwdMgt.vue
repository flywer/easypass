<template>
  <!--  顶部按钮栏-->
  <a-layout-header id="toolHeader" class="card">
    <!--弹出框-->
    <a-button type="text" size="large" @click="showAddCardModal">
      <plus-outlined class="icon"/>
    </a-button>
    <AddGroupModal :visible="visible" @getVisible="setVisible" @getGroupName="setGroupName"/>

    <a-button type="text" size="large" style="float: right">
      <more-outlined class="icon"/>
    </a-button>
  </a-layout-header>

  <a-layout-content id="cardView">
    <div style="padding: 20px">
      <a-row :gutter="16">
        <a-col :span="8" v-for="(item,index) in groupList" style="margin-bottom: 15px">
          <a-card :title="item.name" :bordered="false" :hoverable="true" size="small" head-style="">
            <template #extra>
              <a-button type="link" style="padding-right: 0;">
                <more-outlined/>
              </a-button>
            </template>
            <p>card content</p>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </a-layout-content>
</template>

<script setup>
import {useRoute} from "vue-router"
import {onMounted, reactive, ref, watch} from "vue";
import {PlusOutlined, MoreOutlined} from "@ant-design/icons-vue";
import AddGroupModal from "./addGroupModal.vue";

const route = useRoute()

//菜单key
const menuKey = ref("100")
watch(() => route.params.key, () => {
  console.log(route.params)
  menuKey.value = route.params.key
})

const visible = ref(false)
//const newGroupName = ref('默认')

//显示弹出框
const showAddCardModal = () => {
  visible.value = true;
}

const setVisible = (value) => {
  visible.value = value
}


const defaultGroupItem = reactive({
  name: '默认'
})

const groupList = reactive([])

onMounted(() => {
  groupList.push(defaultGroupItem)
})

const setGroupName = (value) => {
  //console.log(value)
  //newGroupName.value = value
  groupList.push(reactive({name: value}))
}


</script>

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
