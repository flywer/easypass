<script setup lang="ts">
import {computed, reactive, ref, createVNode, onMounted} from 'vue';
import type {Ref} from 'vue';
import {
  CheckOutlined,
  MoreOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined
} from '@ant-design/icons-vue';
import {useRoute, useRouter} from "vue-router";
import {GroupItem} from "@main/model/groupItem";
import {uuid} from 'vue3-uuid';
import {Form, FormInstance, Modal, message} from "ant-design-vue";
import {cloneDeep, isEqual} from "lodash-es";
import {getItemsListByItemId, saveOrUpdateGroupItems} from "@render/api/groupItem.api";
import {store} from "@render/store";

const router = useRouter()
const route = useRoute()

/*数据*/
const formDataRef = ref(<any>[]);
/*起始数据*/
let originData = [
  {name: '标题', value: '', isTitle: true, isShow: true, key: uuid.v1(), deleteTag: false},
  {name: '账号', value: '', isAccount: true, isShow: true, key: uuid.v1(), deleteTag: false},
  {name: '密码', value: '', isPassword: true, isShow: false, key: uuid.v1(), deleteTag: false}
];
/*加载消息key*/
const loadingKey = 'save'
/*表单响应实例*/
const formRef = ref<FormInstance>()
// 校验规则
const rulesRef = ref({
  name: [
    {required: true, message: '名称不能为空', trigger: 'change'},
    {min: 1, max: 10, message: '名称最大长度为10', trigger: 'change',}
  ],
  value: [
    {required: true, message: '内容不能为空', trigger: 'change'},
    {max: 64, message: '值最大长度为64', trigger: 'change'}
  ]
})
//是否为更新操作
const isUpdate = ref(false)

onMounted(async () => {
  let itemId = route.query.itemId as string
  if (itemId != null) {
    isUpdate.value = true
    let result = (await getItemsListByItemId(itemId)).data.result
    originData = []
    result.forEach(res => {
      let item = res
      item.key = uuid.v1()
      item.deleteTag = false
      originData.push(item)
    })
  } else
    isUpdate.value = false
  formDataRef.value = cloneDeep(originData)
})

/*添加组项*/
const handleAddItem = () => {
  const newData = {
    name: '',
    value: '',
    isShow: false,
    deleteTag: false,
    key: uuid.v1()
  };
  formDataRef.value.push(newData);
};

/*删除*/
const handleDelete = (id: string, key: string) => {
  //无id说明为新增的
  if (id == null) {
    formDataRef.value = cloneDeep(formDataRef.value.filter(item => item.key !== key))
  } else {
    formDataRef.value.forEach(item => {
      if (item.key == key) {
        delete item.daleteTag
        item.deleteTag = true
      }
    })
  }
};

/*返回*/
const handleBack = () => {
  if (!isEqual(formDataRef.value, originData)) {
    Modal.confirm({
      title: '提示',
      icon: createVNode(ExclamationCircleOutlined),
      content: '确认放弃当前内容？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        router.back()
      },
    });
  } else {
    router.back()
  }
}

/*提交*/
const handleSubmit = () => {
  formRef.value?.validate().then(() => {
    message.loading({
      content: '保存中...', key: loadingKey
    });
    saveOrUpdateGroupItems(formDataRef.value, store.currentGroupId, isUpdate.value).then((res) => {
      if (res.data.success) {
        message.success({content: res.data.message, key: loadingKey, duration: 2})
        router.back()
      } else {
        message.error({content: res.data.message, key: loadingKey, duration: 2})
      }
    }).catch(e => {
      console.error(e)
      message.error({content: '操作失败', key: loadingKey, duration: 2})
    })
  }).catch(e => {
    console.error(e)
  })
}

</script>

<template>
  <!--  顶部按钮栏 -->
  <a-layout-header id="tool-header">
    <a-space>
      <a-space>
        <!--返回-->
        <a-button class="tool-btn" type="text" size="large" @click="handleBack">
          <arrow-left-outlined class="icon"/>
        </a-button>
      </a-space>
      <!--新增-->
      <a-button class="tool-btn" type="text" size="large" @click="handleAddItem">
        <PlusOutlined class="icon"/>
      </a-button>
    </a-space>
    <!--右侧-->
    <a-space style="float: right">
      <!--保存-->
      <a-button class="tool-btn" size="large" @click="handleSubmit" style="padding: 0 12px;">
        保存
      </a-button>
      <a-button class="tool-btn" type="text" size="large">
        <MoreOutlined class="icon"/>
      </a-button>
    </a-space>
  </a-layout-header>
  <a-layout-content id="content-view" style="background-color: white">
    <a-form :model="formDataRef" ref="formRef" autocomplete="off">
      <a-space :size="0" v-for="(item,index) in formDataRef" v-show="!item.deleteTag">
        <a-form-item class="form-item" :name="[index,'name']"
                     :rules="rulesRef.name">
          <a-input placeholder="名称" :bordered="false" v-model:value.trim="item.name"
                   :readonly="item.isAccount||item.isTitle"/>
          <a-divider class="my-form-divider"/>
        </a-form-item>
        <a-divider type="vertical" class="my-form-divider-vertical"/>
        <a-form-item :name="[index,'value']" class="form-item" :rules="rulesRef.value" s>
          <a-input placeholder="内容" :bordered="false" v-model:value="item.value" style="width: 250px;"/>
          <a-divider class="my-form-divider"/>
        </a-form-item>
        <template v-if="!item.isTitle">
          <a-divider type="vertical" class="my-form-divider-vertical"/>
          <a-form-item class="form-item">
            <a-checkbox v-model:checked="item.isShow">是否显示</a-checkbox>
          </a-form-item>
        </template>
        <template v-if="!item.isAccount && !item.isTitle">
          <a-divider type="vertical" class="my-form-divider-vertical"/>
          <MinusCircleOutlined @click="handleDelete(item.id,item.key)" style="margin-left: 4px;margin-bottom: 17px"/>
        </template>
      </a-space>
    </a-form>
  </a-layout-content>
</template>

<style scoped lang="less">

.form-item {
  //margin-bottom: 12px
}

.my-form-divider {
  margin: 0;
  border-top: 1px solid rgb(159 159 159 / 56%);
}

.my-form-divider-vertical {
  margin-bottom: 12px;
  border-left: 1px solid rgb(114 114 114 / 47%);
}

</style>

<style>
.ant-form-item-explain-error {
  font-size: 12px;
}
</style>
