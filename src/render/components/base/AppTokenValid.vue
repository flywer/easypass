<template>
  <a-layout-content>
    <iframe :src="cloudHtmlUrl" style="height: 568px;width: 917px;overflow: hidden;"/>
    <div class="content" style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);">
      <!--background-color: #ffffff0a;-->
      <!--      <p class="title" style=" text-align: center;margin: 12px auto 12px auto;">请输入登录令牌</p>-->
      <a-input-group compact>
        <a-input class="input" style="width: 70%;background-color: rgba(255,255,255,0.43);" v-model:value="token"
                 placeholder="请输入登录令牌"/>
        <a-button style="width: 30%;background-color: rgba(255,255,255,0.68);" @click="checkToken" :loading="loading"
                  :disabled="store.tokenCheckRemainTimes<1">确定
        </a-button>
      </a-input-group>
    </div>
  </a-layout-content>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {checkAppToken, getResourcePath} from "@render/api/app.api";
import {store} from "@render/store";
import {message} from "ant-design-vue";
import {isEmpty} from "lodash-es";

const token = ref('')
const loading = ref(false)

const errorKey = `open${Date.now()}`;
const checkToken = () => {
  if (!isEmpty(token.value)) {
    loading.value = true
    checkAppToken(token.value).then(res => {
      if (res.data.success) {
        store.tokenCheckRemainTimes = 5
        store.showTokenPanel = false
      } else {
        store.tokenCheckRemainTimes--
        message.error({content: res.data.message, key: errorKey});
      }
    }).then(() => {
      loading.value = false
    })
  }
}

const cloudHtmlUrl = ref('')

onMounted(async () => {
  let res = (await getResourcePath()).data.result
  cloudHtmlUrl.value =  res + '/assets/cloud/index.html'
})

</script>

<style lang="less" scoped>
@import "ant-design-vue/dist/antd.variable.less";

.panel {
  width: 100%;
  height: 100%;
  background: linear-gradient(-45deg, @primary-3, white 36%);
}

.input::-webkit-input-placeholder {
  color: @primary-4;
}
</style>
