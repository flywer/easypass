<!-- 添加分组弹窗 -->
<script setup lang="ts">
import {onMounted, reactive, ref, watch} from 'vue'
import {Form, message} from 'ant-design-vue'
import {savePwdGroup} from "@render/api/pwdMgt.api";

// 父组件传过来的值，是否显示
const props = defineProps({
  visible: Boolean,
})

// 定义事件
const emit = defineEmits(['setVisible', 'updateTable'])

// region 校验表单、提交表单
// 表单属性
const modelRef = reactive({
  id: null,
  name: '',
  description: ''
})

// 校验规则
const rulesRef = reactive({
  name: [
    {
      required: true,
      message: '请输入分组名',
    }, {
      min: 1,
      max: 10,
      message: '组名长度范围为1-10',
      trigger: 'change',
    },
  ],
  description: [
    {
      required: false
    }, {
      max: 13,
      message: '描述过长',
    }
  ]
})

// 提取检验方法
const useForm = Form.useForm
const {resetFields, validate, validateInfos} = useForm(modelRef, rulesRef)

// 点击确定
const handleOk = (e) => {
  // 校验表单
  validate().then(async () => {
    //空值则为null
    if (Object.is(modelRef.description, ''))
      modelRef.description = null
    savePwdGroup(modelRef).then(res => {
      if (res.data.success) {
        message.success(res.data.message)
      } else {
        message.error(res.data.message + res.data.result)
      }
    }).then(() => {
      // 关闭弹窗
      emit('setVisible', false)
      //重置model
      resetFields()
      // 刷新界面
      emit('updateTable', true)
    })
  }).catch((err) => {
    console.log('error', err)
  })
}
// endregion

// 取消
const handleCancel = () => {
  emit('setVisible', false)
}

const modalWrap = ref()
</script>

<template>
  <div ref="modalWrap" class="modalWrap">
    <a-modal
        v-model:visible='visible'
        width="50%"
        :getContainer="modalWrap"
        :closable="true"
        ok-text="添加"
        cancel-text="取消"
        @ok="handleOk"
        @cancel="handleCancel"
    >
      <template #title>
        添加分组
      </template>

      <a-form autocomplete="off" :label-col="{span: 5, offset: 0,style: { width: '150px' }}" :wrapper-col="{span: 18}">
        <a-form-item
            label="分组名"
            name="name"
            v-bind="validateInfos.name"
        >
          <a-input
              v-model:value="modelRef.name"
              placeholder="分组名称最多10个字"
          />
        </a-form-item>
        <a-form-item
            label="描述"
            name="name"
            v-bind="validateInfos.description"
        >
          <a-input
              v-model:value="modelRef.description"
              placeholder="对分组进行描述"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.modalWrap {
  :deep(.ant-modal-body) {
    padding: 12px 12px 0 12px;
  }

  :deep(.ant-modal-header) {
    border-radius: 12px 12px 0 0;
  }

  :deep(.ant-modal-content) {
    border-radius: 12px;
  }
}
</style>
