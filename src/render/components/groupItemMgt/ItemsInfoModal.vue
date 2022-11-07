<!--查看账号组详情弹窗-->
<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {CopyOutlined} from '@ant-design/icons-vue'
import {copyText} from "@render/utils/clipboard";
import {useRouter} from "vue-router";
import {isEmpty, isEqual, isNull} from "lodash-es";
import {getItemTypeEnum} from "@render/api/groupItem.api";

const router = useRouter()

const props = defineProps({
  visible: Boolean,
  model: {default: []}
})

const emit = defineEmits(['setItemVisible'])

/*直接使用props属性在打包后会报错，这里新建一个属性去复制visible的值*/
const modalVisible = ref()
watch(() => props.visible, (value) => {
  modalVisible.value = value
})

watch(() => modalVisible.value, () => {
  emit('setItemVisible', modalVisible.value)
})

/*组项类型*/
const itemType = ref()

onMounted(async () => {
  itemType.value = (await getItemTypeEnum()).data.result
})

/*排除图标*/
const itemInfoList = computed(() => {
  return props.model.filter(item => !isEqual(item.type, itemType.value.icon) && !isEqual(item.type, itemType.value.title))
})

/*图标URL*/
const iconUrl = computed(() => {
  return props.model.filter(item => isEqual(item.type, itemType.value.icon)).map(item => item.value).at(0)
})

//提取标题
const title = computed(() => {
  let titleItem = props.model.filter(item => isEqual(item.type, itemType.value.title))
  return titleItem.at(0).value;
})
//提取itemId
const itemId = computed(() => {
  let titleItem = props.model.filter(item => isEqual(item.type, itemType.value.title))
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
        v-model:visible='modalVisible'
        width="50%"
        :closable="false"
        :getContainer="modalWrap"
        :footer="null"
    >
      <template #title>
        <a-row>
          <a-col :span="8">
            <a-space>
              <a-avatar v-if="!isEmpty(iconUrl)" :src="iconUrl" style="margin-bottom: 4px" shape="square"/>
              <a-avatar v-if="isEmpty(iconUrl)" style="margin-bottom: 4px" shape="square">{{ title.slice(0,1) }}</a-avatar>
              <a-typography-title :level="5" style="margin-top: 4px;width: 295px">{{ title }}</a-typography-title>
            </a-space>
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
    /*border-radius: 12px 12px 0 0;*/
  }

  :deep(.ant-modal-body) {
    max-height: 364px;
    overflow-y: auto;
  }

  :deep(.ant-modal-close-x) {
    width: 30px;
    height: 30px;
    line-height: 30px;
  }


  /*  :deep(.ant-modal-content) {
      border-radius: 12px;
    }*/
}
</style>

