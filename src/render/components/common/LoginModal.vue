<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import {login, register} from "@render/api/user.api";
import {message} from "ant-design-vue";
import {store} from "@render/store";
import {cloneDeep, isEmpty, random} from "lodash-es";

const modalWrap = ref()
// 父组件传过来的值，是否显示
const props = defineProps({
  visible: Boolean,
})

// 定义事件
const emit = defineEmits(['setVisible', 'updateTable'])

const tabActiveKey = ref('1')

interface FormState {
  account: string;
  password: string;
}

const loginFormState = reactive<FormState>({
  account: '',
  password: '',
});

const registerFormState = reactive<FormState>({
  account: '',
  password: '',
});

const spinning = reactive({
  loginBtnSpinning: false,
  registerBtnSpinning: false
})

const onLoginFinish = async (values: any) => {
  spinning.loginBtnSpinning = true
  let result = await login({account: values.account, password: values.password, mode: '02'})
  if (result.data.tag == 2) {
    message.success(result.data.message)
    store.isLogin = true
    store.user = cloneDeep(result.data.result)
    // 关闭弹窗
    emit('setVisible', false)
    // 刷新界面
    emit('updateTable', true)
  } else {
    message.warn(result.data.message)
  }
  spinning.loginBtnSpinning = false
};

const onRegisterFinish = (values: any) => {
  spinning.registerBtnSpinning = true
  //设置初始昵称
  if (isEmpty(values.name))
    values.name = '小白' + random(100000, 999999)
  register({
    account: values.account,
    name: values.name,
    mode: '02',
    password: values.password
  }).then(async  res=>{
    if (res.data.success) {
      message.success(res.data.message)
      //登录
      let result = await login({
        account: values.account,
        password: values.password
      })
      if (result.data.tag == 2) {
        store.isLogin = true
        store.user = cloneDeep(result.data.result)
      } else {
        message.warn(result.data.message)
      }
      // 关闭弹窗
      emit('setVisible', false)
      // 刷新界面
      emit('updateTable', true)
    } else message.warn(res.data.message)
  }).catch(e => {
    console.error(e)
  })
  spinning.registerBtnSpinning = false
};

const loginDisabled = computed(() => {
  return !(loginFormState.account && loginFormState.password);
});

const registerDisabled = computed(() => {
  return !(registerFormState.account && registerFormState.password);
});


</script>

<template>
  <div ref="modalWrap" class="modalWrap">
    <a-modal
        v-model:visible='visible'
        width="35%"
        :getContainer="modalWrap"
        :closable="true"
        ok-text="登录"
        cancel-text="取消"
    >
      <a-tabs v-model:activeKey="tabActiveKey" id="tabs-view" centered>
        <a-tab-pane key="1" tab="登录">
          <a-form
              :model="loginFormState"
              @finish="onLoginFinish"
              :label-col="{ style: { width: '70px' }}"
          >
            <a-form-item
                label="用户名"
                name="account"
                :rules="[{ required: true, message: '用户名不可为空' },{max:24,message: '最大长度为24'}]"
            >
              <a-input v-model:value="loginFormState.account">
                <template #prefix>
                  <UserOutlined class="site-form-item-icon"/>
                </template>
              </a-input>
            </a-form-item>
            <a-form-item
                label="密码"
                name="password"
                :rules="[{ required: true, message: '密码不可为空' },{max:24,message: '最大长度为24'}]"
            >
              <a-input-password v-model:value="loginFormState.password">
                <template #prefix>
                  <LockOutlined class="site-form-item-icon"/>
                </template>
              </a-input-password>
            </a-form-item>
            <a-form-item>
              <a-button :loading="spinning.loginBtnSpinning" :disabled="loginDisabled" type="primary" html-type="submit"
                        style="width: 100%;">
                登录
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="2" tab="注册">
          <a-form
              :model="registerFormState"
              @finish="onRegisterFinish"
              :label-col="{ style: { width: '70px' }}"
          >
            <a-form-item
                label="用户名"
                name="account"
                :rules="[{ required: true, message: '用户名不可为空' },{min:6,max:24,message:'用户名长度在6-24之间'}]"
            >
              <a-input v-model:value="registerFormState.account">
                <template #prefix>
                  <UserOutlined class="site-form-item-icon"/>
                </template>
              </a-input>
            </a-form-item>
            <a-form-item
                label="密码"
                name="password"
                :rules="[{ required: true, message: '密码不可为空' },{min:6,max:24,message: '密码长度在6-24之间'}]"
            >
              <a-input-password v-model:value="registerFormState.password">
                <template #prefix>
                  <LockOutlined class="site-form-item-icon"/>
                </template>
              </a-input-password>
            </a-form-item>
            <a-form-item>
              <a-button :disabled="registerDisabled" type="primary" html-type="submit" style="width: 100%;">
                注册
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.modalWrap {

  /*  :deep(.ant-modal-content) {
      border-radius: 8px;
    }*/

  :deep(.ant-modal-body) {
    padding-bottom: 2px;
  }

  :deep(.ant-modal-header) {
    display: none;
  }

  :deep(.ant-modal-footer) {
    display: none;
  }

  :deep(.ant-modal-close-x) {
    width: 32px;
    height: 32px;
  }

  :deep(.ant-modal-close-icon) {
    vertical-align: 0.7em;
  }
}
</style>
