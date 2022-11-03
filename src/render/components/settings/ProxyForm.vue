<script setup lang="ts">
import {createVNode, onMounted, reactive, ref} from "vue";
import {cloneDeep, isEqual} from 'lodash-es'
import {appRelaunch, getAppProxySettings, setLoginMode, setProxy} from "@render/api/app.api";
import {Form, message, Modal} from "ant-design-vue";
import {Rule} from "ant-design-vue/es/form";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
import {store} from "@render/store";

const proxyFormRef = reactive({
  proxyMode: '01',
  model: {
    proxyType: '01',
    hostname: '',
    port: null,
    bypassList: ''
  }
})

onMounted(async () => {
  getAppProxySettings().then(res => {
    if (res.data.success) {
      const result = res.data.result
      proxyFormRef.proxyMode = result.proxyMode
      proxyFormRef.model = result.model
    }
  })
})

const onNoProxy = () => {
  proxyFormRef.proxyMode = '01'
  setProxy(proxyFormRef).then(res => {
    if (res.data.success) {
      Modal.confirm({
        title: '网络代理配置成功',
        icon: createVNode(ExclamationCircleOutlined),
        content: '此操作需要重启应用，是否继续？',
        okText: '确认',
        cancelText: '取消',
        async onOk() {
          await appRelaunch()
        },
      });
    } else {
      message.error(res.data.message)
    }
  })
}


/*校验规则*/
const proxyFormRulesRef = reactive({
  hostname: [
    {required: true, message: '主机名不可为空', trigger: 'change'},
    {
      pattern: new RegExp(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, "g"),
      message: '主机名无效',
      trigger: 'change'
    }
  ],
  port: [{required: true, message: '端口号不可为空', trigger: 'change'}]
})

/*提交*/
const onSubmit = () => {
  setProxy(proxyFormRef).then(res => {
    if (res.data.success) {
      Modal.confirm({
        title: '网络代理配置成功',
        icon: createVNode(ExclamationCircleOutlined),
        content: '此操作需要重启应用，是否继续？',
        okText: '确认',
        cancelText: '取消',
        async onOk() {
          await appRelaunch()
        },
      });
    } else {
      message.error(res.data.message)
    }
  })
}

const formReset = () => {
  getAppProxySettings().then(res => {
    if (res.data.success) {
      const result = res.data.result
      proxyFormRef.proxyMode = result.proxyMode
      proxyFormRef.model = result.model
    }
  })
}
</script>

<template>
  <a-radio-group v-model:value="proxyFormRef.proxyMode">
    <a-radio-button value="01" @click="onNoProxy">无代理</a-radio-button>
    <a-radio-button value="02">手动代理配置</a-radio-button>
  </a-radio-group>
  <a-form
      :model="proxyFormRef.model"
      v-show="isEqual(proxyFormRef.proxyMode,'02')"
      :label-col="{span:6}"
      :wrapper-col="{span:14}"
      style="margin-top: 18px"
      @finish="onSubmit"
  >
    <a-form-item label="代理类型">
      <a-radio-group v-model:value="proxyFormRef.model.proxyType">
        <a-radio-button value="01">HTTP</a-radio-button>
        <a-radio-button value="02">SOCKS</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="主机名：" name="hostname" :rules="proxyFormRulesRef.hostname">
      <a-input v-model:value="proxyFormRef.model.hostname"/>
    </a-form-item>
    <a-form-item label="端口号：" name="port" :rules="proxyFormRulesRef.port">
      <a-input-number v-model:value="proxyFormRef.model.port" :min="0"/>
    </a-form-item>
    <a-form-item label="不为以下项使用代理">
      <a-input v-model:value="proxyFormRef.model.bypassList"/>
    </a-form-item>
    <a-form-item :wrapper-col="{ offset:6,span:24}">
      <a-button style="width: 20%;margin-right: 20px" @click="formReset">重置</a-button>
      <a-button type="primary" html-type="submit" style="width: 40%;">确认</a-button>
    </a-form-item>
  </a-form>

</template>

<style scoped>

</style>
