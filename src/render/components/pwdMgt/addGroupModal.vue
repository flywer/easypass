<!-- 添加分组弹窗 -->
<script setup lang="ts">
import { reactive } from 'vue'
import { Form } from 'ant-design-vue'

// 父组件传过来的值，是否显示
defineProps({
  visible: Boolean,
})

// 定义事件
const emit = defineEmits(['getVisible', 'getGroupName'])

const useForm = Form.useForm

// region 校验表单、提交表单
// 表单属性
const modelRef = reactive({
  groupName: '',
})

// 校验规则
const rulesRef = reactive({
  groupName: [
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
const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef)

// 点击确定
const handleOk = (e) => {
  // 校验表单
  validate().then(() => {
    // 关闭弹窗
    emit('getVisible', false)
    // 传递新分组名
    emit('getGroupName', modelRef.groupName)
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
    v-model:visible="visible"
    title="添加分组"
    width="50%"
    get-container="#toolHeader"
    body-style="padding:10px"
    ok-text="确定"
    cancel-text="取消"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form autocomplete="off">
      <a-form-item
        label="分组名"
        name="groupName"
        style="margin-bottom: 0"
        v-bind="validateInfos.groupName"
      >
        <a-input
          v-model:value="modelRef.groupName"
          placeholder="分组名称最多10个字"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>

</style>
