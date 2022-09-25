<script setup lang="ts">
// 父组件传过来的值，是否显示
import {savePwdGroup} from "@render/api/pwdMgt/pwdMgt.api";
import {Form} from "ant-design-vue";
import {reactive,ref} from "vue";

const props = defineProps({
  searchInputVisible: Boolean,
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


</script>

<template>
  <a-modal
      v-model:visible='visible'
      title="添加账号"
      width="50%"
      body-style="padding:10px"
      getContainer="#tool-header"
      ok-text="确定"
      cancel-text="取消"
      @ok="handleOk"
      @cancel="handleCancel"
  >
    <a-form autocomplete="off">
      <a-form-item
          label="分组名"
          name="name"
          style="margin-bottom: 0"
          v-bind="validateInfos.name"
      >
        <a-input
            v-model:value="modelRef.name"
            placeholder="分组名称最多10个字"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>

</style>
