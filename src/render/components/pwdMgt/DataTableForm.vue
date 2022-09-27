<script setup lang="ts">
import {computed, reactive, ref, createVNode, onMounted} from 'vue';
import type {Ref, UnwrapRef} from 'vue';
import {
  CheckOutlined,
  MoreOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue';
import {useRouter} from "vue-router";
import {GroupItem} from "@main/model/groupItem";
import {uuid} from 'vue3-uuid';
import {Form, FormInstance, Modal} from "ant-design-vue";
import {cloneDeep, isEqual} from "lodash-es";
import {saveGroupItems} from "@render/api/groupItem.api";

const router = useRouter()
/*表头*/
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    width: '20%',
  },
  {
    title: '内容',
    dataIndex: 'value',
    width: '40%',
  },
  {
    title: '是否为账号',
    dataIndex: 'isAccount',
    width: '15%',
  },
  {
    title: '是否为密码',
    dataIndex: 'isPassword',
    width: '15%',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '20%',
  }
];
/*数据*/
const formDataRef: Ref<typeof GroupItem[]> = ref([
  {name: '标题', value: '', isTitle: true, key: uuid.v1()},
  {name: '账号', value: '', isAccount: true, key: uuid.v1()},
  {name: '密码', value: '', isPassword: true, key: uuid.v1()}
]);
/*起始数据*/
const originData = [
  {name: '标题', value: '', isTitle: true, key: uuid.v1()},
  {name: '账号', value: '', isAccount: true, key: uuid.v1()},
  {name: '密码', value: '', isPassword: true, key: uuid.v1()}
];
/*数据量+1*/
const count = computed(() => formDataRef.value.length + 1);

onMounted(() => {
  formDataRef.value = cloneDeep(originData)
})

const handleAdd = () => {
  const newData = {
    name: `名称${count.value}`,
    value: '',
    key: uuid.v1()
  };
  formDataRef.value.push(newData);
};

const onDelete = (key: string) => {
  formDataRef.value =
      formDataRef.value.filter(item => item.key !== key);
};

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

const handleSubmit = () => {
  formRef.value
      ?.validate()
      .then((res) => {
        saveGroupItems(formDataRef.value)
        console.log(formDataRef.value)
      })
      .catch((err) => {
        console.log('失败', err)
      })
}

const formRef = ref<FormInstance>()


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
      <a-button class="tool-btn" type="text" size="large" @click="handleAdd">
        <PlusOutlined class="icon"/>
      </a-button>
    </a-space>
    <!--右侧-->
    <a-space style="float: right">
      <!--保存-->
      <a-button class="tool-btn" type="text" size="large" @click="handleSubmit">
        <check-outlined class="icon" style="color: #52c41a"/>
      </a-button>
      <a-button class="tool-btn" type="text" size="large">
        <MoreOutlined class="icon"/>
      </a-button>
    </a-space>
  </a-layout-header>

  <a-layout-content id="content-view">
    <a-form ref="formRef" :model="formDataRef" autocomplete="off">
      <a-table
          :data-source="formDataRef"
          :columns="columns"
          size="small"
          :pagination="{defaultCurrent:1,pageSize: 6}"
          class="ant-table-striped"
          :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
          bordered
      >
        <template #bodyCell="{column,text,index,record }">

          <template v-if="column.dataIndex === 'name'">
            <div class="editable-cell">
              <!--主标题不可更改-->
              <div v-if="!record.isTitle" class="editable-cell-input-wrapper">
                <a-form-item
                    :name="[index,'name']"
                    style="margin: 0"
                    :rules="[
                        {required:true,message: '名称不能为空',trigger:'blur'},
                        {min: 1, max: 10,message: '名称最大长度为10',trigger: 'change',}]">
                  <a-input v-model:value="record.name" :bordered="false" placeholder="请输入名称..."/>
                </a-form-item>
              </div>
              <div v-else class="editable-cell-text-wrapper">
                <span style="padding-left: 5px">{{ text || '' }}</span>
              </div>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'value'">
            <div class="editable-cell-input-wrapper">
              <a-form-item
                  :name="[index,'value']"
                  style="margin: 0"
                  :rules="[{required:true,message: '内容不能为空',trigger:'blur'}]">
                <a-input v-model:value="record.value" :bordered="false" placeholder="请输入内容..."/>
              </a-form-item>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'isPassword'">
            <a-switch v-model:checked="record.isPassword"/>
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <a-popconfirm
                v-if="!record.isTitle"
                title="确认删除？"
                @confirm="onDelete(record.key)"
                ok-text="确认"
                cancel-text="取消"
            >
              <a>删除</a>
            </a-popconfirm>
          </template>

        </template>
      </a-table>
    </a-form>
  </a-layout-content>
</template>

<style scoped lang="less">
.editable-cell {
  position: relative;

  .editable-cell-text-wrapper {
    padding: 5px 0 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.ant-table-striped :deep(.table-striped) td {
  background-color: rgba(248, 248, 248, 0.98);
}
</style>
