<!--查看账号组详情弹窗-->
<script setup lang="ts">

// 父组件传过来的值，是否显示
import {computed, ref} from "vue";
import {GroupItem} from "@main/model/groupItem";
import {CopyOutlined} from '@ant-design/icons-vue'
import {copyText} from "@render/utils/clipboard";
import {useRouter} from "vue-router";
import {isEqual} from "lodash-es";

const router = useRouter()

const props = defineProps({
  visible: Boolean,
  model: {default: []}
})

/*排除图标*/
const itemInfoList = computed(() => {
  return props.model.filter(item => !isEqual(item.type, '05'))
})

const iconUrl = computed(() => {
  return props.model.filter(item => isEqual(item.type, '05')).map(item => item.value).at(0)
})

//提取标题
const title = computed(() => {
  let titleItem = props.model.filter(item => item.isTitle == true)
  return titleItem.at(0).value;
})
//提取itemId
const itemId = computed(() => {
  let titleItem = props.model.filter(item => item.isTitle == true)
  return titleItem.at(0).itemId;
})

const editItems = () => {
  router.push(
      {
        name: 'groupItemTableForm',
        query: {itemId: itemId.value}
      }
  )
}

const modalWrap = ref()

</script>

<template>
  <div ref="modalWrap" class="modalWrap">
    <a-modal
        v-model:visible='visible'
        width="50%"
        :closable="false"
        :getContainer="modalWrap"
        :footer="null"
    >
      <template #title>
        <a-row>
          <a-col :span="8">
            <a-space> <a-avatar :src="iconUrl"/>
              <a-typography-title :level="5" style="margin-top: 4px;">{{ title }}</a-typography-title></a-space>
          </a-col>
          <a-col :span="8" :offset="8">
            <a-button type="link" style="float: right" @click="editItems">编辑</a-button>
          </a-col>
        </a-row>
      </template>

      <a-row v-for="(item) in itemInfoList" style="margin-bottom: 12px" class="row-hover">
        <a-col :span="4" :offset="1" align="right" style="float: right">{{ item.name }}&nbsp;:</a-col>
        <a-col :span="16" style="margin-left: 9px;">{{ item.value }}</a-col>
        <a-col :span="2" :offset="0">
          <copy-outlined @click="copyText(item.value,true)"/>
        </a-col>
      </a-row>
      <template #footer/>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.row-hover:hover {
  background-color: #f8f8f8;
}

.modalWrap {
  :deep(.ant-modal-header) {
    padding-bottom: 0;
    border-radius: 12px 12px 0 0;
  }

  :deep(.ant-modal-body) {
    max-height: 364px;
    overflow-y: auto;
  }

  :deep(.ant-modal-content) {
    border-radius: 12px;
  }
}
</style>

