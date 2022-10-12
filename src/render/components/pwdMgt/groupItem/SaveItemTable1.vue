<script setup lang="ts">
import {computed, reactive, ref, createVNode, onMounted} from 'vue';
import type {Ref} from 'vue';
import {
  CheckOutlined,
  MoreOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  UserOutlined, LockOutlined, MinusCircleOutlined
} from '@ant-design/icons-vue';
import {useRouter} from "vue-router";
import {GroupItem} from "@main/model/groupItem";
import {uuid} from 'vue3-uuid';
import {Form, FormInstance, Modal, message} from "ant-design-vue";
import {cloneDeep, isEqual} from "lodash-es";
import {saveGroupItems} from "@render/api/groupItem.api";
import {store} from "@render/store";
import {logger} from "sequelize/types/utils/logger";

const router = useRouter()
/*数据*/
const formDataRef: Ref<typeof GroupItem[]> = ref();
/*起始数据*/
const originData = [
  {name: '标题', value: '', isTitle: true, isShow: true, key: uuid.v1()},
  {name: '账号', value: '', isAccount: true, isShow: true, key: uuid.v1()},
  {name: '密码', value: '', isPassword: true, isShow: false, key: uuid.v1()}
];
/*数据量+1*/
const count = computed(() => formDataRef.value.length + 1);
/*加载消息key*/
const loadingKey = 'save'
/*表单响应实例*/
const formRef = ref<FormInstance>()
// 校验规则
const rulesRef = ref({
  name: [
    {required: true, message: '名称不能为空', trigger: 'blur'},
    {min: 1, max: 10, message: '名称最大长度为10', trigger: 'blur',}
  ],
  value: [
    {required: true, message: '内容不能为空', trigger: 'blur'}
  ]
})

onMounted(() => {
  formDataRef.value = cloneDeep(originData)
})

/*添加组项*/
const handleAddItem = () => {
  const newData = {
    name: `名称${count.value}`,
    value: '',
    isShow: false,
    key: uuid.v1()
  };
  formDataRef.value.push(newData);
};

/*删除*/
const handleDelete = (key: string) => {
  formDataRef.value = formDataRef.value.filter(item => item.key !== key);
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
    saveGroupItems(formDataRef.value, store.currentGroupId).then((res) => {
      if (res.data == null)
        console.log('失败', res.error)
      else {
        message.success({
          content: '创建成功!',
          key: loadingKey,
          duration: 1
        }).then(() => {
          router.back()
        })
      }
    })
  }).catch(e => {
    console.log(e)
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
      <a-button class="tool-btn" type="text" size="large" @click="handleSubmit">
        <check-outlined class="icon" style="color: #52c41a"/>
      </a-button>
      <a-button class="tool-btn" type="text" size="large">
        <MoreOutlined class="icon"/>
      </a-button>
    </a-space>
  </a-layout-header>

  <a-layout-content id="content-view" style="background-color: white">
    <a-form :model="formDataRef" ref="formRef" autocomplete="off">
      <a-space :size="0" v-for="(item,index) in formDataRef">
        <a-form-item class="form-item" :name="[index,'name']"
                     :rules="rulesRef.name">
          <a-input placeholder="名称" :bordered="false" v-model:value="item.name"
                   :readonly="item.isAccount||item.isTitle"/>
          <a-divider class="my-form-divider"/>
        </a-form-item>
        <a-divider type="vertical" class="my-form-divider-vertical"/>
        <a-form-item :name="[index,'value']" class="form-item" :rules="rulesRef.value">
          <a-input placeholder="内容" :bordered="false" v-model:value="item.value"/>
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
          <MinusCircleOutlined @click="handleDelete(item.key)" style="margin-left: 4px;margin-bottom: 17px"/>
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
