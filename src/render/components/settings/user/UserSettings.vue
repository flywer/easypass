<script setup lang="ts">
import RowCard from "@render/components/settings/RowCard.vue";
import SecondaryText from "@render/components/settings/SecondaryText.vue";
import {onMounted, reactive, ref, watch} from "vue";
import {cloneDeep, isEmpty, isEqual, isNull, isUndefined, random} from "lodash-es";
import {
  cancellation,
  checkPassword,
  login,
  logout,
  register,
  registerCheck,
  updateUserInfoByUserId
} from "@render/api/user.api";
import {Form, FormInstance, message, Modal} from "ant-design-vue";
import {store} from "@render/store";
import {
  CheckOutlined,
  CopyOutlined,
  DownOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  SwapOutlined,
  UpOutlined
} from '@ant-design/icons-vue'
import {copyText} from "@render/utils/clipboard";
import {
  appRelaunch,
  getCommonTextContent,
  setCommonAccount,
  setCommonPassword
} from "@render/api/app.api";
import {Rule} from "ant-design-vue/es/form";
import EmailBindCard from "@render/components/settings/user/EmailBindCard.vue";

//region 用户登录、注册
const loginCardRef = reactive({
  activeSpinning: false,
  isLoginCard: true,/*当前是否为登录框*/
  loginText: '登录',
  registerText: '注册',
  titleText: '登录',
  swapText: '注册',
  loginModel: {
    account: '',
    password: ''
  },
  registerModel: {
    name: '',
    account: '',
    password: ''
  }
})

/*表单规则*/
const formRules = reactive({
  account: [{required: true, message: '用户名不可为空'}, {min: 6, max: 24, message: '用户名长度在6-24之间'}],
  password: [{required: true, message: '密码不可为空'}, {min: 6, max: 24, message: '密码长度在6-24之间'}]
})

/*注册*/
const onRegister = async () => {
  loginCardRef.activeSpinning = true

  //检查账号是否已被注册
  const res = (await registerCheck({account: loginCardRef.registerModel.account})).data
  if (res.success) {
    //设置初始昵称
    if (isEmpty(loginCardRef.registerModel.name))
      loginCardRef.registerModel.name = '小白' + random(100000, 999999)
    register({
      account: loginCardRef.registerModel.account,
      name: loginCardRef.registerModel.name,
      mode: '02',
      password: loginCardRef.registerModel.password
    }).then(async res => {
      if (res.data.success) {
        message.success(res.data.message)
        //登录
        let result = await login({
          account: loginCardRef.registerModel.account,
          password: loginCardRef.registerModel.password
        })
        if (result.data.tag == 2) {
          store.isLogin = true
          store.user = cloneDeep(result.data.result)
        } else {
          message.warn(result.data.message)
        }
      } else message.warn(res.data.message)

      //初始化
      loginCardRef.registerModel = {
        name: '',
        account: '',
        password: ''
      }
      loginCardRef.activeSpinning = false
    }).catch(e => {
      console.error(e)
    })
  } else {
    message.warn(res.message)
    loginCardRef.activeSpinning = false
  }
}

/*登录*/
const onLogin = async () => {
  loginCardRef.activeSpinning = true

  let result = await login({account: loginCardRef.loginModel.account, password: loginCardRef.loginModel.password})
  if (result.data.tag == 2) {
    message.success(result.data.message)
    store.isLogin = true
    store.user = cloneDeep(result.data.result)
  } else {
    message.warn(result.data.message)
  }
  loginCardRef.activeSpinning = false
}

/*登录注册框切换*/
const swapCard = () => {
  loginCardRef.isLoginCard = !loginCardRef.isLoginCard
  loginCardRef.swapText = loginCardRef.isLoginCard ? '注册' : '登录'
  loginCardRef.titleText = loginCardRef.isLoginCard ? '登录' : '注册'
}
//endregion

//region 用户退出
/*退出*/
const onLogout = async () => {
  store.isLogin = false
  store.user = {
    id: null,
    mode: '02'
  }
  loginCardRef.loginModel.account = ''
  loginCardRef.loginModel.password = ''
  await logout()
}
//endregion

//region 用户信息
const userInfoRef = reactive({
  isEdit: false,
  name: store.user.name,
  account: store.user.account,
  model: {
    name: ''
  }
})

/*监听获取应用初始的用户名信息*/
watch(() => store.user.name, (value) => {
  userInfoRef.name = value
})

/*是否更改用户名*/
const onEditUserName = () => {
  userInfoRef.isEdit = !userInfoRef.isEdit
  userInfoRef.model.name = store.user.name
}

/*更新用户名*/
const onUpdateUserName = () => {
  if (isEmpty(userInfoRef.model.name)) {
    message.error('名称不可为空！')
    return null
  } else if (isEmpty(store.user.id)) {
    message.error('登录异常，请重启应用尝试解决')
    return null
  } else {
    updateUserInfoByUserId({name: userInfoRef.model.name, id: store.user.id}).then(res => {
      if (res.data.success) {
        message.success(res.data.message)
        userInfoRef.isEdit = false
        store.user.name = userInfoRef.model.name
        userInfoRef.model.name = ''
      } else
        message.warn(res.data.message)
    })
  }
}
//endregion

//region 用户注销
let cancelCardRef = reactive({
  isConfirm: false,
  cancelFormBtnText: '取消',
  canReturn: true,/*点击取消返回*/
  model: {
    password: ''
  }
})

/*监听注销时密码输入框是否输入了值*/
watch(() => cancelCardRef.model.password, (value) => {
  if (isEmpty(value)) {
    cancelCardRef.canReturn = true
    cancelCardRef.cancelFormBtnText = '取消'
  } else {
    cancelCardRef.canReturn = false
    cancelCardRef.cancelFormBtnText = '确认'
  }
})

/*确认提交*/
const onCancelCardSwap = () => {
  cancelCardRef.isConfirm = true
}

/*注销*/
const onAccountCancellation = () => {
  if (cancelCardRef.canReturn) {
    cancelCardRef.isConfirm = false
  } else {
    checkPassword({account: store.user.account, password: cancelCardRef.model.password}).then(res => {
          if (res.data.success) {
            cancellation(store.user).then(res => {
              if (res.data.success) {
                message.success(res.data.message)
                store.isLogin = false
                store.user = {
                  id: null,
                  mode: '02'
                }
              } else {
                message.warn(res.data.message)
              }
            })
          } else {
            message.warn('密码错误！')
          }

          cancelCardRef.isConfirm = false
          cancelCardRef.model.password = ''
        }
    )
  }
}
//endregion

//region 密码修改
const updatePasswordVisible = ref(false)

/*显示修改密码框*/
const onShowUpdatePasswordModal = () => {
  updatePasswordVisible.value = !updatePasswordVisible.value
}

const updatePasswordModelRef = reactive({
  oldPassword: '',
  newPassword: '',
  checkPass: ''
});

const validatePass2 = async (_rule: Rule, value: string) => {
  if (value !== updatePasswordModelRef.newPassword) {
    return Promise.reject("两次密码不同");
  } else {
    return Promise.resolve();
  }
};

const updatePasswordRulesRef = reactive({
  oldPassword: [
    {required: true, message: '请输入原密码', trigger: 'change'},
  ],
  newPassword: [
    {required: true, message: '密码不能为空', trigger: 'change'}, {min: 6, max: 24, message: '密码长度在6-24之间'}
  ],
  checkPass: [
    {required: true, message: '不可为空', trigger: 'change'},
    {validator: validatePass2, trigger: 'change'}
  ],
});


const useForm = Form.useForm;
const {resetFields, validate, validateInfos} = useForm(updatePasswordModelRef, updatePasswordRulesRef);

const onUpdatePassword = () => {
  validate().then(() => {
    //校验原密码是否正确
    checkPassword({account: store.user.account, password: updatePasswordModelRef.oldPassword}).then(res => {
          if (res.data.success) {
            updateUserInfoByUserId({password: updatePasswordModelRef.newPassword, id: store.user.id}).then(res => {
              if (res.data.success) {
                message.success(res.data.message)
                updatePasswordVisible.value = false
              } else
                message.warn(res.data.message)
            })
          } else {
            message.warn('原密码错误！')
            resetFields()
          }
        }
    )
  }).catch((err) => {
    console.log(err)
  })
}

//endregion

//region 常用账号、密码

const commonAccountRef = reactive({
  isForm: false,
  model: {
    commonAccount: ''
  },
  rules: {
    commonAccount: [{required: true, message: '账号不可为空'}, {max: 128, message: '最大长度为128'}]
  },
  isSubmit: false,
  isSet: false
})
const commonAccountFormRef = ref<FormInstance>()

/*常用账号保存*/
const onCommonAccountFormSubmit = () => {
  commonAccountRef.isSubmit = true
  setCommonAccount(commonAccountRef.model.commonAccount).then(res => {
    if (res.data.success) {
      message.success(res.data.message)
      commonAccountRef.isSet = true
    } else {
      message.warn(res.data.message)
    }
  }).then(() => {
    commonAccountRef.isSubmit = false
    commonAccountRef.isForm = false
  })
}

/*常用账号重置*/
const onAccountReset = () => {
  setCommonAccount(null).then(res => {
    if (res.data.success) {
      message.success('重置成功')
      commonAccountRef.isSet = false
    } else {
      message.warn('重置失败')
    }
  })
}

/*表单关闭*/
const onHideCommonAccountForm = () => {
  commonAccountRef.isForm = false
  commonAccountFormRef.value.resetFields()
}

const commonPasswordRef = reactive({
  isForm: false,
  model: {
    commonPassword: ''
  },
  rules: {
    commonPassword: [{required: true, message: '密码不可为空'}, {max: 128, message: '最大长度为128'}]
  },
  isSubmit: false,
  isSet: false
})
const commonPasswordFormRef = ref<FormInstance>()

/*常用密码保存*/
const onCommonPasswordFormSubmit = () => {
  commonPasswordRef.isSubmit = true
  setCommonPassword(commonPasswordRef.model.commonPassword).then(res => {
    if (res.data.success) {
      message.success(res.data.message)
      commonPasswordRef.isSet = true
    } else {
      message.warn(res.data.message)
    }
  }).then(() => {
    commonPasswordRef.isSubmit = false
    commonPasswordRef.isForm = false
  })
}

/*常用密码重置*/
const onPasswordReset = () => {
  setCommonPassword(null).then(res => {
    if (res.data.success) {
      message.success('重置成功')
      commonPasswordRef.isSet = false
    } else {
      message.warn('重置失败')
    }
  })
}

/*表单关闭*/
const onHideCommonPasswordForm = () => {
  commonPasswordRef.isForm = false
  commonPasswordFormRef.value.resetFields()
}

onMounted(async () => {
  let commonText = (await getCommonTextContent()).data.result;
  //常用账号设置
  commonAccountRef.isSet = !(isUndefined(commonText.commonAccount) || isNull(commonText.commonAccount) || commonText.commonAccount.length == 0);
  //常用密码设置
  commonPasswordRef.isSet = !(isUndefined(commonText.commonPassword) || isNull(commonText.commonPassword) || commonText.commonPassword.length == 0);
})

//endregion

</script>

<template>
  <a-layout-content class="setting-content">
    <!--用户登录-->
    <RowCard v-if="!store.isLogin" class="user-login-card">
      <template #left>用户{{ loginCardRef.titleText }}</template>
      <template #right>
        <a-space>
          <a-space>
            <a-button type="link" class="swap-btn" @click="swapCard" :disabled="loginCardRef.activeSpinning">
              <swap-outlined/>
              <span style="margin-left: 1px">{{ loginCardRef.swapText }}</span>
            </a-button>
          </a-space>
          <div>
            <!--登录-->
            <a-form class="animate__animated animate__flipInX" v-show="loginCardRef.isLoginCard">
              <a-input-group compact>
                <a-form-item>
                  <a-input placeholder="用户名" style="width: 200px" maxlength="24"
                           v-model:value="loginCardRef.loginModel.account"/>
                </a-form-item>
                <a-form-item>
                  <a-input-password placeholder="密码" style="width: 200px" maxlength="24"
                                    v-model:value.trim="loginCardRef.loginModel.password"/>
                  <a-button :loading="loginCardRef.activeSpinning" @click="onLogin"
                            :disabled="loginCardRef.loginModel.password==='' || loginCardRef.loginModel.account === ''">
                    {{ loginCardRef.loginText }}
                  </a-button>
                </a-form-item>
              </a-input-group>
            </a-form>
            <!--注册-->
            <a-form
                class="animate__animated animate__flipInX"
                v-show="!loginCardRef.isLoginCard"
                :model="loginCardRef.registerModel"
                @finish="onRegister"
            >
              <a-input-group compact>
                <a-form-item name="account" :rules="formRules.account">
                  <a-input placeholder="取个好记的账号吧" style="width: 200px"
                           v-model:value="loginCardRef.registerModel.account"/>
                </a-form-item>
                <a-form-item name="password" :rules="formRules.password">
                  <a-input-password placeholder="想个复杂的密码吧" style="width: 200px"
                                    v-model:value.trim="loginCardRef.registerModel.password"/>
                  <a-button html-type="submit" :loading="loginCardRef.activeSpinning"
                            :disabled="loginCardRef.registerModel.password===''">
                    {{ loginCardRef.registerText }}
                  </a-button>
                </a-form-item>
              </a-input-group>
            </a-form>
          </div>
        </a-space>
      </template>
    </RowCard>
    <!--用户信息-->
    <RowCard v-if="store.isLogin">
      <template #left>
        <a-space style="gap:2px">
          <span>账号:</span>
          <span>{{ store.user.account }}</span>
          <copy-outlined style="margin-left: 4px" @click="copyText(userInfoRef.account,true)"/>
          <span style="border-left: 1px solid rgb(191 191 191);margin: 0 12px 0 12px"/>
          <span>用户名：</span>
          <span v-show="!userInfoRef.isEdit" style="max-width: 200px">{{ userInfoRef.name }}</span>
          <a-input v-show="userInfoRef.isEdit" :bordered="true" maxlength="12" style="max-width: 200px"
                   v-model:value="userInfoRef.model.name" @keyup.enter="onUpdateUserName"></a-input>
          <a-button v-show="!userInfoRef.isEdit" type="text" @click="onEditUserName">
            <edit-outlined/>
          </a-button>
          <a-button v-show="userInfoRef.isEdit" type="text" @click="onUpdateUserName">
            <check-outlined/>
          </a-button>
        </a-space>
      </template>
      <template #right>
        <a-button @click="onLogout">退出</a-button>
      </template>
    </RowCard>
    <!--密码修改-->
    <RowCard v-if="store.isLogin" :bottom-card-visible="updatePasswordVisible">
      <template #left>
        <a-space style="gap:2px">
          密码修改
        </a-space>
      </template>
      <template #right>
        <a-button v-if="!updatePasswordVisible" class="animate__animated animate__flipInX"
                  @click="onShowUpdatePasswordModal">
          <template #icon>
            <down-outlined/>
          </template>
          修改
        </a-button>
        <a-button v-if="updatePasswordVisible" class="animate__animated animate__flipInX"
                  @click="onShowUpdatePasswordModal">
          <template #icon>
            <up-outlined/>
          </template>
          取消
        </a-button>
      </template>
      <template #bottom-card>
        <a-form :label-col="{span:4}" :wrapper-col="{span:24}">
          <a-form-item label="原密码" v-bind="validateInfos.oldPassword">
            <a-input v-model:value="updatePasswordModelRef.oldPassword" type="password" autocomplete="off"/>
          </a-form-item>
          <a-form-item has-feedback label="新密码" v-bind="validateInfos.newPassword">
            <a-input v-model:value="updatePasswordModelRef.newPassword" type="password" autocomplete="off"/>
          </a-form-item>
          <a-form-item has-feedback label="密码确认" v-bind="validateInfos.checkPass">
            <a-input v-model:value="updatePasswordModelRef.checkPass" type="password" autocomplete="off"/>
          </a-form-item>
          <a-form-item :wrapper-col="{ offset:9,span:24}">
            <a-button type="primary" @click.prevent="onUpdatePassword" style="width: 40%;">提交</a-button>
          </a-form-item>
        </a-form>
      </template>
    </RowCard>
    <!--账号注销-->
    <RowCard v-if="store.isLogin">
      <template #left>
        <a-space style="gap:2px">
          账号注销
          <SecondaryText>
            <template #text>将永久删除公共服务器中账号数据</template>
          </SecondaryText>
        </a-space>
      </template>
      <template #right>
        <a-button v-show="!cancelCardRef.isConfirm" class="animate__animated animate__flipInX" danger
                  @click="onCancelCardSwap">注销
        </a-button>
        <a-input-group v-show="cancelCardRef.isConfirm" compact class="animate__animated animate__flipInX">
          <a-input-password placeholder="请输入密码" style="width: 200px" @keyup.enter="onAccountCancellation"
                            v-model:value="cancelCardRef.model.password"/>
          <a-button @click="onAccountCancellation">{{ cancelCardRef.cancelFormBtnText }}</a-button>
        </a-input-group>
      </template>
    </RowCard>
    <!--绑定邮箱-->
    <EmailBindCard/>
    <a-divider class="setting-divider"/>
    <!--常用账号-->
    <RowCard>
      <template #left>常用账号
        <SecondaryText>
          <template #text>点击左下角按钮复制使用</template>
        </SecondaryText>
      </template>
      <template #right>
        <a-button class="animate__animated animate__flipInX"
                  v-show="!commonAccountRef.isForm && !commonAccountRef.isSet"
                  @click="commonAccountRef.isForm = true">设置
        </a-button>
        <a-button class="animate__animated animate__flipInX"
                  v-show="!commonAccountRef.isForm && commonAccountRef.isSet"
                  @click="onAccountReset">重置
        </a-button>
        <a-form
            class="animate__animated animate__flipInX row-card-form"
            v-show="commonAccountRef.isForm"
            :model="commonAccountRef.model"
            @finish="onCommonAccountFormSubmit"
            ref="commonAccountFormRef"
        >
          <a-input-group compact>
            <a-form-item name="commonAccount" style="width: 200px" :rules="commonAccountRef.rules.commonAccount">
              <a-input v-model:value="commonAccountRef.model.commonAccount" placeholder="请输入常用账号" allow-clear/>
            </a-form-item>
            <a-form-item>
              <a-button
                  v-if="!isEmpty(commonAccountRef.model.commonAccount)"
                  html-type="submit"
                  :loading="commonAccountRef.isSubmit"
              >保存
              </a-button>
              <a-button v-if="isEmpty(commonAccountRef.model.commonAccount)" @click="onHideCommonAccountForm">
                取消
              </a-button>
            </a-form-item>
          </a-input-group>
        </a-form>
      </template>
    </RowCard>
    <!--常用密码-->
    <RowCard>
      <template #left>常用密码
        <SecondaryText>
          <template #text>点击左下角按钮复制使用</template>
        </SecondaryText>
      </template>
      <template #right>
        <a-button class="animate__animated animate__flipInX"
                  v-show="!commonPasswordRef.isForm && !commonPasswordRef.isSet"
                  @click="commonPasswordRef.isForm = true">设置
        </a-button>
        <a-button class="animate__animated animate__flipInX"
                  v-show="!commonPasswordRef.isForm && commonPasswordRef.isSet"
                  @click="onPasswordReset">重置
        </a-button>
        <a-form
            class="animate__animated animate__flipInX row-card-form"
            v-show="commonPasswordRef.isForm"
            :model="commonPasswordRef.model"
            @finish="onCommonPasswordFormSubmit"
            ref="commonPasswordFormRef"
        >
          <a-input-group compact>
            <a-form-item name="commonPassword" style="width: 200px" :rules="commonPasswordRef.rules.commonPassword">
              <a-input-password v-model:value="commonPasswordRef.model.commonPassword" placeholder="请输入常用密码"
                                allow-clear/>
            </a-form-item>
            <a-form-item>
              <a-button
                  v-if="!isEmpty(commonPasswordRef.model.commonPassword)"
                  html-type="submit"
                  :loading="commonPasswordRef.isSubmit"
              >保存
              </a-button>
              <a-button v-if="isEmpty(commonPasswordRef.model.commonPassword)"
                        @click="onHideCommonPasswordForm">
                取消
              </a-button>
            </a-form-item>
          </a-input-group>
        </a-form>
      </template>
    </RowCard>
  </a-layout-content>
</template>

<style scoped lang="less">
.swap-btn {
  padding-right: 2px;
  margin-bottom: 20px;
  padding-left: 2px;
  font-size: 13px;
}

.user-login-card {
  :deep(.ant-form-item-explain-error) {
    font-size: 11px;
  }
}

:deep(.ant-form-item-explain-error) {
  font-size: 11px;
}
</style>
