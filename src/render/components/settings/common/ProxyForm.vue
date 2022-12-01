<script setup lang="ts">
import {createVNode, onMounted, reactive, ref} from "vue";
import {isEqual} from 'lodash-es'
import {appRelaunch, getAppProxySettings, setProxy} from "@render/api/app.api";
import {message, Modal} from "ant-design-vue";
import {ExclamationCircleOutlined, QuestionCircleOutlined} from "@ant-design/icons-vue";

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

const bypassTooltip1 = "示例:"
const bypassTooltip2 = "'<local>;*.google.com;*foo.com;1.2.3.4:5678'"
const bypassTooltip3 = "含义为除了本地地址(localhost,127.0.0.1等等.), google.com子域名, 包含foo.com后缀的主机地址, 以及任何在1.2.3.4:5678上的地址以外的所有主机都将使用此代理服务器"

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
      <a-space>
        <a-input v-model:value="proxyFormRef.model.bypassList"/>
        <a-tooltip>
          <template #title>
            <p>{{ bypassTooltip1 }}</p>
            <p>{{ bypassTooltip2 }}</p>
            <p>{{ bypassTooltip3 }}</p>
          </template>
          <question-circle-outlined/>
        </a-tooltip>
      </a-space>
    </a-form-item>
    <a-form-item :wrapper-col="{ offset:6,span:24}">
      <a-button style="width: 20%;margin-right: 20px" @click="formReset">重置</a-button>
      <a-button type="primary" html-type="submit" style="width: 40%;">确认</a-button>
    </a-form-item>
  </a-form>

</template>

<style scoped>

</style>
