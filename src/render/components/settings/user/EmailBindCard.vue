<script setup lang="ts">
import {reactive} from "vue";
import {store} from "@render/store";
import {randomValidCode} from "@render/utils/randomValidCode";
import {sendEmail} from "@render/api/utils.api";
import {message} from "ant-design-vue";
import {isEqual, isNull, isEmpty} from "lodash-es";
import {updateUserInfoByUserId} from "@render/api/user.api";
import SecondaryText from "@render/components/settings/SecondaryText.vue";
import RowCard from "@render/components/settings/RowCard.vue";

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
  <RowCard v-if="store.isLogin">
    <template #left>绑定邮箱
      <SecondaryText v-show="isEmpty(store.user.email)">
        <template #text>用于找回密码</template>
      </SecondaryText>
      <SecondaryText v-show="!isEmpty(store.user.email)">
        <template #text>
          {{
            isNull(store.user.email) ? '' : store.user.email.slice(0, 3) + '***' +
                store.user.email.slice(store.user.email.indexOf('@') - 1)
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
          class="animate__animated animate__flipInX row-card-form"
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
          class="animate__animated animate__flipInX row-card-form"
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
          class="animate__animated animate__flipInX row-card-form"
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
          class="animate__animated animate__flipInX row-card-form"
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
          class="animate__animated animate__flipInX row-card-form"
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
          class="animate__animated animate__flipInX row-card-form"
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
          class="animate__animated animate__flipInX row-card-form"
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
          class="animate__animated animate__flipInX row-card-form"
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
</template>

<style scoped lang="less">

.cancel-email-bind {
  padding-right: 2px;
  padding-left: 2px;
  font-size: 13px;
}
</style>
