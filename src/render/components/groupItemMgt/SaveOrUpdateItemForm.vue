<script setup lang="ts">
import {ref, createVNode, onMounted, reactive} from 'vue';
import {
  MoreOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  CheckOutlined,
  DragOutlined,
  SwapOutlined
} from '@ant-design/icons-vue';
import {useRoute, useRouter} from "vue-router";
import {uuid} from 'vue3-uuid';
import {Form, FormInstance, Modal, message} from "ant-design-vue";
import {cloneDeep, isEqual, isNull} from "lodash-es";
import {getItemsListByItemId, getItemTypeEnum, saveOrUpdateGroupItems} from "@render/api/groupItem.api";
import draggable from 'vuedraggable'
import {findImage} from "@render/api/utils.api";
import {isEmpty} from "lodash";

const router = useRouter()
const route = useRoute()

/*数据*/
const formDataRef = ref(<any>[]);
/*组项类型*/
const itemType = ref()
/*起始数据*/
let originData = [];
/*加载消息key*/
const loadingKey = 'save'
/*表单响应实例*/
const formRef = ref<FormInstance>()
// 校验规则
const rulesRef = ref({
  name: [
    {required: true, message: '名称不能为空', trigger: 'change'},
    {min: 1, max: 10, message: '名称最大长度为10', trigger: 'change',}
  ],
  value: [
    {required: true, message: '内容不能为空', trigger: 'change'},
    {max: 64, message: '值最大长度为64', trigger: 'change'}
  ]
})
//是否为更新操作
const isUpdate = ref(false)
//密码组ID
let groupId = null

onMounted(async () => {
  itemType.value = (await getItemTypeEnum()).data.result
  originDataInit()

  let itemId = route.query.itemId as string
  groupId = route.query.groupId as string
  if (itemId != null) {
    isUpdate.value = true
    let result = (await getItemsListByItemId(itemId)).data.result
    originData = []
    result.forEach(res => {
      let item = res
      item.key = uuid.v1()
      item.deleteTag = false
      originData.push(item)
    })
    let iconData = originData.filter(item => isEqual(item.type, itemType.value.icon))
    iconRef.value = iconData.length > 0 ? iconData.at(0).value : null
  } else {
    isUpdate.value = false
    iconRef.value = null
  }
  formDataRef.value = cloneDeep(originData)
})

/*初始化空表单*/
const originDataInit = () => {
  originData = [
    {
      name: '标题',
      value: '',
      isShow: true,
      key: uuid.v1(),
      deleteTag: false,
      type: itemType.value.title
    },
    {
      name: '账号',
      value: '',
      isShow: true,
      key: uuid.v1(),
      deleteTag: false,
      type: itemType.value.account
    },
    {
      name: '密码',
      value: '',
      isShow: false,
      key: uuid.v1(),
      deleteTag: false,
      type: itemType.value.password
    }
  ]
}

/*添加组项*/
const handleAddItem = () => {
  const newData = {
    name: '',
    value: '',
    type: itemType.value.normal,
    isShow: false,
    deleteTag: false,
    key: uuid.v1()
  };
  formDataRef.value.push(newData);
};

/*删除*/
const handleDelete = (id: string, key: string) => {
  //无id说明为新增的
  if (id == null) {
    formDataRef.value = cloneDeep(formDataRef.value.filter(item => item.key !== key))
  } else {
    formDataRef.value.forEach(item => {
      if (item.key == key) {
        delete item.daleteTag
        item.deleteTag = true
      }
    })
  }
};

/*返回*/
const handleBack = () => {
  if (!isEqual(formDataRef.value, originData)) {
    Modal.confirm({
      title: '提示',
      icon: createVNode(ExclamationCircleOutlined),
      content: '确认放弃当前内容？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        router.back()
      },
    });
  } else {
    router.back()
  }
}

/*提交*/
const handleSubmit = () => {
  if (!isEqual(formDataRef.value, originData))
    formRef.value?.validate().then(() => {
      message.loading({
        content: '保存中...', key: loadingKey
      });
      if (isUpdate.value) {
        //旧数据没有图标，现在新增一个
        if (isEmpty(formDataRef.value.filter(item => isEqual(item.type, itemType.value.icon)))) {
          console.log(iconRef.value)
          formDataRef.value.push({
            name: '图标',
            type: itemType.value.icon,
            value: isNull(iconRef.value)?'':iconRef.value, //可能只更新了其他数据，没有更新图标
            deleteTag: false,
            isShow: false
          })
        } else {
          /*更新*/
          formDataRef.value.forEach(item => {
            if (isEqual(item.type, itemType.value.icon)) {
              item.value = iconRef.value
            }
          })
        }
      } else {
        formDataRef.value.push({
          name: '图标',
          type: itemType.value.icon,
          value: iconRef.value,
          deleteTag: false,
          isShow: false
        })
      }

      saveOrUpdateGroupItems(formDataRef.value, groupId, isUpdate.value).then((res) => {
        if (res.data.success) {
          message.success({content: res.data.message, key: loadingKey, duration: 2})
          router.back()
        } else {
          message.error({content: res.data.message, key: loadingKey, duration: 2})
        }
      }).catch(e => {
        console.error(e)
        message.error({content: '操作失败', key: loadingKey, duration: 2})
      })
    }).catch(e => {
      console.error(e)
    })
  else
    router.back()
}

const draggableRef = reactive({
  enabled: false,
  dragging: false
})

const onDragSort = () => {
  draggableRef.enabled = !draggableRef.enabled
  if (draggableRef.enabled) {

  }
}

/*图标*/
const iconRef = reactive({
  value: null,
  imagesUrl: [],
  visible: false
})

const onFindIcon = async (title: string) => {
  if (!isEmpty(title))
    await findImage(title, 12).then(res => {
      if (res.data.success) {
        iconRef.imagesUrl = cloneDeep(res.data.result)
        iconRef.value = iconRef.imagesUrl.at(0)
      } else {
        iconRef.imagesUrl = []
        iconRef.value = null
      }
    })
}

const onchangeIcon = (icon) => {
  iconRef.value = icon
  iconRef.visible = false
}


</script>

<template>
  <!--  顶部按钮栏 -->
  <a-layout-header id="tool-header">
    <a-space>
      <a-space>
        <!--返回-->
        <a-button class="tool-btn" type="text" size="large" @click="handleBack">
          <arrow-left-outlined class="icon"/>
        </a-button>
      </a-space>
      <!--新增-->
      <a-button class="tool-btn" type="text" size="large" @click="handleAddItem">
        <PlusOutlined class="icon"/>
      </a-button>
    </a-space>
    <!--右侧-->
    <a-space style="float: right">
      <a-button @click="onDragSort">
        <template #icon>
          <swap-outlined :rotate="90" v-if="!draggableRef.enabled" class="animate__animated animate__flipInX"/>
          <check-outlined v-if="draggableRef.enabled" class="animate__animated animate__flipInX"/>
        </template>
        <span v-if="!draggableRef.enabled" class="animate__animated animate__flipInX">排序</span>
        <span v-if="draggableRef.enabled" class="animate__animated animate__flipInX">确认</span>
      </a-button>
      <a-button class="tool-btn" @click="handleSubmit" style="padding: 0 12px;">
        <template #icon>
          <check-outlined/>
        </template>
        保存
      </a-button>

      <a-button class="tool-btn" type="text" size="large">
        <MoreOutlined class="icon"/>
      </a-button>
    </a-space>
  </a-layout-header>
  <a-layout-content id="content-view" style="background-color: white">
    <a-form :model="formDataRef" ref="formRef" autocomplete="off">
      <draggable :list="formDataRef"
                 :disabled="!draggableRef.enabled"
                 item-key="key"
                 @start="draggableRef.dragging = true"
                 @end="draggableRef.dragging = false"
      >
        <template #item="{ element,index }">
          <a-space class="form-space animate__animated animate__flipInX"
                   :style="{backgroundColor: draggableRef.enabled?'#f6f6f6':null} "
                   :size="0"
                   v-show="!element.deleteTag"
          >
            <!--名称-->
            <a-form-item
                v-if="!isEqual(element.type,itemType.icon)"
                class="form-item"
                :name="[index,'name']"
                :rules="rulesRef.name"
            >
              <a-input placeholder="名称"
                       :bordered="false"
                       v-model:value.trim="element.name"
                       :readonly="isEqual(element.type,itemType.account) || isEqual(element.type,itemType.title)"/>
              <a-divider class="my-form-divider"/>
            </a-form-item>
            <!--内容-->
            <a-form-item
                v-if="!isEqual(element.type,itemType.icon)"
                :name="[index,'value']"
                class="form-item"
                :rules="rulesRef.value"
            >
              <a-divider type="vertical" class="my-form-divider-vertical" style="height: 30px;margin-bottom: -2px;"/>
              <a-input placeholder="内容" :bordered="false" v-model:value="element.value" style="width: 250px;"
                       @change="isEqual(element.type,itemType.title)?onFindIcon(element.value):null"/>
              <a-divider class="my-form-divider"/>
            </a-form-item>
            <!--标题特殊项-->
            <template v-if="isEqual(element.type,itemType.title)">
              <a-divider type="vertical" class="my-form-divider-vertical"/>
              <!--图标选择弹框-->
              <a-popover
                  v-if="!isEmpty(iconRef.value) && iconRef.imagesUrl.length>0"
                  v-model:visible="iconRef.visible"
                  trigger="click"
                  placement="bottom"
              >
                <template #content>
                  <a-row :gutter="[0,4]" style="width: 300px;padding-bottom: 8px;">
                    <a-col :span="6" v-for="(item) in iconRef.imagesUrl">
                      <div style="width: 75px;text-align:center">
                        <a-button type="text" style="height: 100%;">
                          <a-avatar shape="square" :src="item" @click="onchangeIcon(item)"/>
                        </a-button>
                      </div>
                    </a-col>
                  </a-row>
                </template>
                <a-avatar class="form-item" size="large" shape="square"
                          style="margin: 0 0 14px 20px;border: 1px #e8e8e8 solid;cursor: pointer"
                          :src="iconRef.value"/>
              </a-popover>
              <!--没有值且未搜索，对应新增时-->
              <a-avatar v-if="isEmpty(iconRef.value) && iconRef.imagesUrl.length===0" size="large" shape="square"
                        style="margin: 0 0 14px 20px;">{{ element.value }}
              </a-avatar>
              <!--有值但未搜索，对应更新时-->
              <a-avatar v-if="!isEmpty(iconRef.value) && iconRef.imagesUrl.length===0" size="large" shape="square"
                        style="margin: 0 0 14px 20px;" :src="iconRef.value"/>
            </template>

            <template v-if="!isEqual(element.type,itemType.title) && !isEqual(element.type,itemType.icon)">
              <a-divider type="vertical" class="my-form-divider-vertical"/>
              <a-form-item class="form-item">
                <a-checkbox v-model:checked="element.isShow">是否显示</a-checkbox>
              </a-form-item>
            </template>

            <template
                v-if="!isEqual(element.type,itemType.account) && !isEqual(element.type,itemType.title) && !isEqual(element.type,itemType.icon)">
              <a-divider type="vertical" class="my-form-divider-vertical"/>
              <MinusCircleOutlined @click="handleDelete(element.id,element.key)"
                                   style="margin-left: 4px;margin-bottom: 17px"/>
            </template>

            <div v-if="!isEqual(element.type,itemType.icon)" style="position: absolute;right: 3%;top: 30%;">
              <drag-outlined class="animate__animated animate__fadeInRight" v-show="draggableRef.enabled"
                             style="float: right;font-size: 24px;color: #cbcbcb;cursor: pointer"/>
            </div>
          </a-space>
        </template>
      </draggable>

    </a-form>
  </a-layout-content>
</template>

<style scoped lang="less">
@import "ant-design-vue/dist/antd.variable.less";

#content-view {
  overflow-x: hidden;
}

.my-form-divider {
  margin: 0;
  border-top: 1px solid rgb(159 159 159 / 56%);
}

.my-form-divider-vertical {
  margin-bottom: 12px;
  border-left: 1px solid rgb(114 114 114 / 47%);
}

.form-space {
  width: 100%;
  padding: 10px 10px 0 10px;
  margin-bottom: 5px;
}

</style>

<style>
.ant-form-item-explain-error {
  font-size: 12px;
}
</style>
