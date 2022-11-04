<script setup lang="ts">
import RowCard from "@render/components/settings/RowCard.vue";
import SecondaryText from "@render/components/settings/SecondaryText.vue";
import {createVNode, onMounted, reactive, ref, watch} from "vue";
import {cloneDeep, isEmpty, isEqual, random, isNull} from "lodash-es";
import {cancellation, checkPassword, login, logout, register, updateUserInfoByUserId} from "@render/api/user.api";
import {message, Modal} from "ant-design-vue";
import {store} from "@render/store";
import {
  EditOutlined,
  CheckOutlined,
  CopyOutlined,
  SwapOutlined,
  ExclamationCircleOutlined,
  DownOutlined,
  UpOutlined
} from '@ant-design/icons-vue'
import {copyText} from "@render/utils/clipboard";
import {appRelaunch, setLoginMode} from "@render/api/app.api";
import {Form} from 'ant-design-vue';
import {Rule} from "ant-design-vue/es/form";
import {sendEmail} from "@render/api/utils.api";
import {randomValidCode} from "@render/utils/randomValidCode";

//region 账号模式
//登录模式切换
const loginMode = ref()
onMounted(() => {
  loginMode.value = store.loginMode
})

/*切换账号模式*/
const onLoginModeChange = () => {
  Modal.confirm({
    title: '切换数据源',
    icon: createVNode(ExclamationCircleOutlined),
    content: '此操作需要重启应用，是否继续？',
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      store.loginMode = loginMode.value
      await setLoginMode(store.loginMode)
      await onLogout()
      await appRelaunch()
    },
    onCancel() {
      loginMode.value = store.loginMode
    }
  });
}

//endregion

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

//region 邮箱绑定
/*邮箱绑定流程属性*/
const emailBindRef = reactive({
  isEmailForm: false,
  emailModel: {
    email: ''
  },
  rules: {
    email: [
      {
        pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
        message: '邮箱格式不正确',
        trigger: 'change'
      }
    ]
  },
  isSubmit: false,
  isValidCodeForm: false,/*验证码表单*/
  validCodeModel: {
    validCode: ''
  },
})
/*显示绑定邮箱表单*/
const onshowEmailForm = () => {
  emailBindRef.isEmailForm = !emailBindRef.isEmailForm
}
/*绑定提交*/
const onEmailFormSubmit = () => {
  store.emailValidCode = randomValidCode()
  emailBindRef.isSubmit = true
  sendEmail({email: emailBindRef.emailModel.email, validCode: store.emailValidCode}, 1).then(res => {
    if (res.data.success) {
      message.success(res.data.message)
      emailBindRef.isEmailForm = false
      emailBindRef.isValidCodeForm = true
    }
  }).then(() => {
    emailBindRef.isSubmit = false
  })
}
/*绑定验证*/
const onValidCodeFormSubmit = () => {
  if (isEqual(emailBindRef.validCodeModel.validCode, store.emailValidCode)) {
    message.success('绑定成功!')
    emailBindRef.isValidCodeForm = false
    updateUserInfoByUserId({email: emailBindRef.emailModel.email, id: store.user.id}).then(res => {
      if (res.data.success) {
        store.user.email = emailBindRef.emailModel.email
      }
    })
  } else {
    message.warn('验证码错误')
  }
}
//endregion

//region 邮箱解绑
/*邮箱解绑流程属性*/
const emailUnbindRef = reactive({
  isEmailUnbindForm: false,
  emailModel: {
    email: ''
  },
  rules: {
    email: [
      {
        pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
        message: '邮箱格式不正确',
        trigger: 'change'
      }
    ]
  },
  isSubmit: false,
  isValidCodeForm: false,/*验证码表单*/
  validCodeModel: {
    validCode: ''
  },
})
const onShowEmailUnbindForm = () => {
  emailBindRef.emailModel.email = null
  emailUnbindRef.isEmailUnbindForm = !emailUnbindRef.isEmailUnbindForm
}
/*解绑提交*/
const onEmailUnbindSubmit = () => {
  if (isEqual(emailUnbindRef.emailModel.email, store.user.email)) {
    store.emailValidCode = randomValidCode()
    emailUnbindRef.isSubmit = true
    sendEmail({email: emailUnbindRef.emailModel.email, validCode: store.emailValidCode}, 2).then(res => {
      if (res.data.success) {
        message.success(res.data.message)
        emailUnbindRef.isEmailUnbindForm = false
        emailUnbindRef.isValidCodeForm = true
      }
    }).then(() => {
      emailUnbindRef.isSubmit = false
    })
  } else {
    message.warn('邮箱错误！')
    emailUnbindRef.isEmailUnbindForm = false
    emailUnbindRef.emailModel.email = ''
  }
}
/*解绑验证*/
const onEmailUnbindValidFormSubmit = () => {
  if (isEqual(emailUnbindRef.validCodeModel.validCode, store.emailValidCode)) {
    message.success('解绑成功!')
    emailUnbindRef.isValidCodeForm = false
    updateUserInfoByUserId({email: null, id: store.user.id}).then(res => {
      if (res.data.success) {
        store.user.email = null
      }
    })
  } else {
    message.warn('验证码错误')
  }
}
//endregion

//region 邮箱换绑
const emailChangeRef = reactive({
  isEmailChangeForm: false,
  emailModel: {
    email: ''
  },
  rules: {
    email: [
      {
        pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
        message: '邮箱格式不正确',
        trigger: 'change'
      }
    ]
  },
  isSubmit: false,
  isValidCodeForm: false,/*验证码表单*/
  validCodeModel: {
    validCode: ''
  },
  isNewEmailForm: false,
  isNewEmailValidCodeForm: false,/*验证码表单*/
  newEmailValidCodeModel: {
    validCode: ''
  },
})

const onShowEmailChangeForm = () => {
  emailChangeRef.isEmailChangeForm = !emailChangeRef.isEmailChangeForm
}

const onEmailChangeFormSubmit = () => {
  if (isEqual(emailChangeRef.emailModel.email, store.user.email)) {
    store.emailValidCode = randomValidCode()
    emailChangeRef.isSubmit = true
    sendEmail({email: emailChangeRef.emailModel.email, validCode: store.emailValidCode}, 3).then(res => {
      if (res.data.success) {
        message.success(res.data.message)
        emailChangeRef.isEmailChangeForm = false
        emailChangeRef.isValidCodeForm = true
      }
    }).then(() => {
      emailChangeRef.isSubmit = false
    })
  } else {
    message.warn('邮箱错误！')
    emailChangeRef.isEmailChangeForm = false
    emailChangeRef.emailModel.email = ''
  }
}

const onEmailChangeValidFormSubmit = () => {
  if (isEqual(emailChangeRef.validCodeModel.validCode, store.emailValidCode)) {
    emailChangeRef.isValidCodeForm = false
    emailChangeRef.isNewEmailForm = true
    emailChangeRef.emailModel.email = null
  } else {
    message.warn('验证码错误')
  }
}

const onshowNewEmailForm = () => {
  emailChangeRef.isNewEmailForm = !emailChangeRef.isNewEmailForm
}

const onNewEmailFormSubmit = () => {
  if (isEqual(emailChangeRef.emailModel.email, store.user.email)) {
    message.warn('邮箱与原邮箱相同！')
  } else {
    store.emailValidCode = randomValidCode()
    emailChangeRef.isSubmit = true
    sendEmail({email: emailChangeRef.emailModel.email, validCode: store.emailValidCode}, 3).then(res => {
      if (res.data.success) {
        message.success(res.data.message)
        emailChangeRef.isNewEmailForm = false
        emailChangeRef.isNewEmailValidCodeForm = true
      }
    }).then(() => {
      emailChangeRef.isSubmit = false
    })
  }

}

const onNewEmailValidFormSubmit = () => {
  if (isEqual(emailChangeRef.newEmailValidCodeModel.validCode, store.emailValidCode)) {
    message.success('绑定成功!')
    emailChangeRef.isNewEmailValidCodeForm = false
    updateUserInfoByUserId({email: emailChangeRef.emailModel.email, id: store.user.id}).then(res => {
      if (res.data.success) {
        store.user.email = emailChangeRef.emailModel.email
      }
    })
  } else {
    message.warn('验证码错误')
  }
}


//endregion
</script>

<template>
  <a-layout-content class="setting-content">
    <!--账号模式-->
    <RowCard>
      <template #left>账号模式
      </template>
      <template #right>
        <a-radio-group v-model:value="loginMode" button-style="solid" @change="onLoginModeChange">
          <a-radio-button value="01">
            <a-tooltip>
              <template #title>本地存储</template>
              本地
            </a-tooltip>
          </a-radio-button>
          <a-radio-button value="02">
            <a-tooltip>
              <template #title>账号可在其他设备登录</template>
              跨平台
            </a-tooltip>
          </a-radio-button>
        </a-radio-group>
      </template>
    </RowCard>
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
    <a-divider class="setting-divider"/>
    <!--绑定邮箱-->
    <RowCard v-if="store.isLogin">
      <template #left>绑定邮箱
        <SecondaryText v-show="isEmpty(store.user.email)">
          <template #text>用于找回密码</template>
        </SecondaryText>
        <SecondaryText v-show="!isEmpty(store.user.email)">
          <template #text>
            {{
              isNull(store.user.email) ? '' : store.user.email.slice(0, 3) + '***' + store.user.email.slice(store.user.email.indexOf('@') - 1)
            }}
          </template>
        </SecondaryText>
      </template>
      <template #right>
        <a-button class="animate__animated animate__flipInX"
                  v-show="!emailBindRef.isEmailForm && !emailBindRef.isValidCodeForm && isNull(store.user.email)"
                  @click="onshowEmailForm">绑定
        </a-button>
        <a-space
            v-show="
            !emailUnbindRef.isEmailUnbindForm &&
            !emailUnbindRef.isValidCodeForm  &&
            !emailChangeRef.isEmailChangeForm &&
             !emailChangeRef.isValidCodeForm &&
             !emailChangeRef.isNewEmailForm &&
             !emailChangeRef.isNewEmailValidCodeForm &&
             !isNull(store.user.email)">
          <a-button type="link" class="cancel-email-bind" @click="onShowEmailUnbindForm">解除绑定</a-button>
          <a-button class="animate__animated animate__flipInX" @click="onShowEmailChangeForm">换绑</a-button>
        </a-space>
        <!--邮箱绑定表单-->
        <a-form
            class="animate__animated animate__flipInX"
            v-show="emailBindRef.isEmailForm"
            :model="emailBindRef.emailModel"
            @finish="onEmailFormSubmit"
        >
          <a-input-group compact>
            <a-form-item name="email" style="width: 200px" :rules="emailBindRef.rules.email">
              <a-input v-model:value="emailBindRef.emailModel.email" placeholder="请输入邮箱"/>
            </a-form-item>
            <a-form-item>
              <a-button
                  v-if="!isEmpty(emailBindRef.emailModel.email)"
                  html-type="submit"
                  :loading="emailBindRef.isSubmit"
              >提交
              </a-button>
              <a-button v-if="isEmpty(emailBindRef.emailModel.email)" @click="onshowEmailForm">取消</a-button>
            </a-form-item>
          </a-input-group>
        </a-form>
        <!--邮箱验证表单-->
        <a-form
            class="animate__animated animate__flipInX"
            v-show="emailBindRef.isValidCodeForm"
            :model="emailBindRef.validCodeModel"
            @finish="onValidCodeFormSubmit"
        >
          <a-input-group compact>
            <a-form-item name="validCode" style="width: 200px">
              <a-input v-model:value="emailBindRef.validCodeModel.validCode" placeholder="请输入验证码"/>
            </a-form-item>
            <a-button html-type="submit">确认</a-button>
          </a-input-group>
        </a-form>

        <!--邮箱解绑表单-->
        <a-form
            class="animate__animated animate__flipInX"
            v-show="emailUnbindRef.isEmailUnbindForm"
            :model="emailUnbindRef.emailModel"
            @finish="onEmailUnbindSubmit"
        >
          <a-input-group compact>
            <a-form-item name="email" style="width: 200px" :rules="emailUnbindRef.rules.email">
              <a-input v-model:value="emailUnbindRef.emailModel.email" placeholder="请输入绑定邮箱"/>
            </a-form-item>
            <a-form-item>
              <a-button
                  v-if="!isEmpty(emailUnbindRef.emailModel.email)"
                  html-type="submit"
                  :loading="emailUnbindRef.isSubmit"
              >提交
              </a-button>
              <a-button v-if="isEmpty(emailUnbindRef.emailModel.email)" @click="onShowEmailUnbindForm">取消</a-button>
            </a-form-item>
          </a-input-group>
        </a-form>
        <!--邮箱解绑验证表单-->
        <a-form
            class="animate__animated animate__flipInX"
            v-show="emailUnbindRef.isValidCodeForm"
            :model="emailUnbindRef.validCodeModel"
            @finish="onEmailUnbindValidFormSubmit"
        >
          <a-input-group compact>
            <a-form-item name="validCode" style="width: 200px">
              <a-input v-model:value="emailUnbindRef.validCodeModel.validCode" placeholder="请输入验证码"/>
            </a-form-item>
            <a-button html-type="submit">确认</a-button>
          </a-input-group>
        </a-form>

        <!--邮箱换绑表单-->
        <a-form
            class="animate__animated animate__flipInX"
            v-show="emailChangeRef.isEmailChangeForm"
            :model="emailChangeRef.emailModel"
            @finish="onEmailChangeFormSubmit"
        >
          <a-input-group compact>
            <a-form-item name="email" style="width: 200px" :rules="emailChangeRef.rules.email">
              <a-input v-model:value="emailChangeRef.emailModel.email" placeholder="请输入已绑定邮箱"/>
            </a-form-item>
            <a-form-item>
              <a-button
                  v-if="!isEmpty(emailChangeRef.emailModel.email)"
                  html-type="submit"
                  :loading="emailChangeRef.isSubmit"
              >提交
              </a-button>
              <a-button v-if="isEmpty(emailChangeRef.emailModel.email)" @click="onShowEmailChangeForm">取消</a-button>
            </a-form-item>
          </a-input-group>
        </a-form>
        <!--邮箱换绑验证表单-->
        <a-form
            class="animate__animated animate__flipInX"
            v-show="emailChangeRef.isValidCodeForm"
            :model="emailChangeRef.validCodeModel"
            @finish="onEmailChangeValidFormSubmit"
        >
          <a-input-group compact>
            <a-form-item name="validCode" style="width: 200px">
              <a-input v-model:value="emailChangeRef.validCodeModel.validCode" placeholder="请输入验证码"/>
            </a-form-item>
            <a-button html-type="submit">确认</a-button>
          </a-input-group>
        </a-form>
        <!--新邮箱绑定表单-->
        <a-form
            class="animate__animated animate__flipInX"
            v-show="emailChangeRef.isNewEmailForm"
            :model="emailChangeRef.emailModel"
            @finish="onNewEmailFormSubmit"
        >
          <a-input-group compact>
            <a-form-item name="email" style="width: 200px" :rules="emailChangeRef.rules.email">
              <a-input v-model:value="emailChangeRef.emailModel.email" placeholder="请输入新的绑定邮箱"/>
            </a-form-item>
            <a-form-item>
              <a-button
                  v-if="!isEmpty(emailChangeRef.emailModel.email)"
                  html-type="submit"
                  :loading="emailChangeRef.isSubmit"
              >提交
              </a-button>
              <a-button v-if="isEmpty(emailChangeRef.emailModel.email)" @click="onshowNewEmailForm">取消</a-button>
            </a-form-item>
          </a-input-group>
        </a-form>
        <!--新邮箱验证表单-->
        <a-form
            class="animate__animated animate__flipInX"
            v-show="emailChangeRef.isNewEmailValidCodeForm"
            :model="emailChangeRef.newEmailValidCodeModel"
            @finish="onNewEmailValidFormSubmit"
        >
          <a-input-group compact>
            <a-form-item name="validCode" style="width: 200px">
              <a-input v-model:value="emailChangeRef.newEmailValidCodeModel.validCode" placeholder="请输入验证码"/>
            </a-form-item>
            <a-button html-type="submit">确认</a-button>
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

.cancel-email-bind {
  padding-right: 2px;
  padding-left: 2px;
  font-size: 13px;
}
</style>
