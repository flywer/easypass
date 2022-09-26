<script setup lang="ts">
// 父组件传过来的值，是否显示
import {savePwdGroup} from "@render/api/pwdMgt.api";
import {Form, FormInstance} from "ant-design-vue";
import {onMounted, reactive, ref} from "vue";
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons-vue';
import {GroupItem} from "@main/model/groupItem";

const props = defineProps({
  addItemModalVisible: Boolean,
})

// 定义事件
const emit = defineEmits(['getVisible', 'createGroup'])

// region 校验表单、提交表单
// 表单属性
const modelRef = ref({
  name: '',
})

// 校验规则
const rulesRef = ref({
  name: [
    {
      required: true,
      message: '请输入分组名',
    }, {
      min: 1,
      max: 10,
      message: '组名长度范围为1-10',
      trigger: 'blur',
    },
  ],
})

// 提取检验方法
const useForm = Form.useForm
const {resetFields, validate, validateInfos} = useForm(modelRef, rulesRef)

// 点击确定
const handleOk = (e) => {
  // 校验表单
  validate().then(async () => {
    // 关闭弹窗
    emit('getVisible', false)
    if ((await savePwdGroup(modelRef)).data != null) {
      // 刷新界面
      emit('createGroup', true)
    } else
      console.log('新增失败!')
    resetFields()
  }).catch((err) => {
    console.log('error', err)
  })
}
// endregion

// 取消
const handleCancel = () => {
  emit('getVisible', false)
}


const formRef = ref<FormInstance>();
const groupItemForm = reactive<{ groupItems: typeof GroupItem[] }>({
  groupItems: [{name: '名称', value: '', isTitle: true},
    {name: '账号', value: '', isAccount: true},
    {name: '密码', value: '', isPassword: true}],
});


const removeUser = (item: typeof GroupItem) => {
  let index = groupItemForm.groupItems.indexOf(item);
  if (index !== -1) {
    groupItemForm.groupItems.splice(index, 1);
  }
};
const addUser = () => {
  groupItemForm.groupItems.push({
    name: '',
    value: '',
  });
};
const onFinish = values => {
  console.log('Received values of form:', values);
  console.log('dynamicValidateForm.users:', groupItemForm.groupItems);
};

</script>

<template>
  <a-modal
      v-model:visible='addItemModalVisible'
      title="添加账号"
      body-style="padding:10px"
      getContainer="#tool-header"
      ok-text="确定"
      cancel-text="取消"
      @ok="handleOk"
      @cancel="handleCancel"
  >
    <a-form
        ref="formRef"
        name="dynamic_form_nest_item"
        :model="groupItemForm"
        @finish="onFinish"
    >
      <a-space
          v-for="(groupItem, index) in groupItemForm.groupItems"
          :key="groupItem.id"
          style="display: flex; margin-bottom: 8px"
          align="baseline"
      >
        <a-form-item
            :name="['groupItems', index, 'name']"
            :rules="{required: true,message: '名称不能为空',}"
        >
          <a-input v-model:value="groupItem.name" placeholder="名称"/>
        </a-form-item>
        <a-form-item
            :name="['groupItems', index, 'value']"
            :rules="{required: true,message: '内容不能为空',}"
        >
          <a-input v-model:value="groupItem.value" placeholder="请输入内容..."/>
        </a-form-item>
        <!--移除按钮-->
        <MinusCircleOutlined v-if="!groupItem.isTitle && !groupItem.isAccount" @click="removeUser(groupItem)"/>
      </a-space>
      <a-form-item>
        <a-button type="dashed" block @click="addUser">
          <PlusOutlined/>
          Add user
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">Submit</a-button>
      </a-form-item>

    </a-form>
  </a-modal>
</template>

<style scoped>

</style>
