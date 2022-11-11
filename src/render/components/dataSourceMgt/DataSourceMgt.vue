<script setup lang="ts">
import {
  MoreOutlined,
  ReloadOutlined,
  CloseOutlined,
  PlusOutlined,
  EllipsisOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons-vue'
import {onMounted, reactive, ref, watch, createVNode} from "vue";
import {addDataSource, getAppDbStat, getDataSourceList} from "@render/api/app.api";
import {FormInstance, message} from "ant-design-vue";
import {cloneDeep, isEmpty, isEqual} from "lodash-es";
import SecondaryText from "@render/components/settings/SecondaryText.vue";
import {defaultOpenDialogOptions, showAppOpenDialog, showAppSaveDialog} from "@render/utils/fileDialog";
import sqlite from '@render/assets/img/db/sqlite.png'
import mysql from '@render/assets/img/db/mysql.png'
import {dataSourceTest} from "@render/api/utils.api";
import {uuid} from "vue3-uuid";

//加载效果是否显示
const spinning = ref(false)
const dataSourceList = ref([])
//刷新动画
let refreshSpin = ref(false)
//刷新动画
const refreshSpinning = () => {
  refreshSpin.value = true
  setTimeout(() => {
    refreshSpin.value = false
  }, 1000)
}
/*表单Ref*/
const formRef = {
  sqliteRef: ref<FormInstance>(),
  mysqlRef: ref<FormInstance>(),
}
/*新增数据源Ref*/
const newDataSourceRef = reactive({
  modalVisible: false,
  selectedDataSource: 1,
  loading: false,
  test: {
    isTesting: false,
    isSuccess: false,
    result: {
      showResult: false,
      visible: false,
      title: '',
      content: ''
    }
  },
  sqliteModel: {
    name: '',
    filePath: ''
  },
  mysqlModel: {
    name: '',
    hostname: '',
    port: 3306,
    username: '',
    password: '',
    database: ''
  }
})
let currentDSId = ref()

onMounted(async () => {
  searchDataSourceList()
  /*当前数据源*/
  currentDSId.value = (await getAppDbStat()).data.result.currentDSId
})

/*查询数据源*/
const searchDataSourceList = () => {
  spinning.value = true
  refreshSpinning()

  getDataSourceList().then(res => {
    if (res.data.success) {
      dataSourceList.value = res.data.result
      dataSourceList.value.forEach(db => {
        db.isHover = false
      })
    } else {
      message.error(res.data.message)
    }
  }).then(() => {
    spinning.value = false
  })
}

/*删除数据源*/
const onDeleteDataSource = () => {

}

/*数据源类型格式化*/
const dialectFormat = (dialect) => {
  if (isEqual(dialect, 'sqlite'))
    return 'SQLite'
}

/*新增数据源框显示*/
const onShowDataSourceModal = () => {
  newDataSourceRef.modalVisible = true
}

/*切换数据源*/
const onChangeDataSource = () => {

}

/*新增数据源*/
const onAddDataSource = () => {
  newDataSourceRef.loading = true
  /*sqlite*/
  if (newDataSourceRef.selectedDataSource == 1) {
    formRef.sqliteRef.value.validate().then(() => {
      const opt = {
        id: uuid.v1(),
        type: 1,
        name: newDataSourceRef.sqliteModel.name,
        dialect: 'sqlite',
        storage: newDataSourceRef.sqliteModel.filePath,
      }
      addDataSource(opt).then(res => {
        if (res.data.success) {
          message.success(res.data.message)
          searchDataSourceList()
        } else {
          message.error(res.data.message)
        }
      }).then(() => {
        newDataSourceRef.modalVisible = false
        newDataSourceRef.loading = false
      })
    }).catch(e => {
      console.log(e)
      newDataSourceRef.loading = false
    })
  }
  /*mysql*/
  if (newDataSourceRef.selectedDataSource == 2) {
    formRef.mysqlRef.value.validate().then(() => {
      let opt = cloneDeep(newDataSourceRef.mysqlModel) as any
      opt.id = uuid.v1()
      opt.type = 2
      addDataSource(opt).then(res => {
        if (res.data.success) {
          message.success(res.data.message)
          searchDataSourceList()
        } else {
          message.error(res.data.message)
        }
      }).then(() => {
        newDataSourceRef.modalVisible = false
        newDataSourceRef.loading = false
      })
    }).catch(e => {
      console.log(e)
      newDataSourceRef.loading = false
    })
  }
}

/*打开数据源文件*/
const OnShowOpenDialog = async () => {
  if (newDataSourceRef.selectedDataSource == 1) {
    let opt = defaultOpenDialogOptions
    opt.title = '选择数据库'
    opt.filters = [{name: 'Sqlite File', extensions: ['sqlite']}]
    const res = await showAppOpenDialog(opt)
    if (res != null) {
      newDataSourceRef.sqliteModel.filePath = res.at(0)
      await formRef.sqliteRef.value.validateFields('filePath')
    }
  }
}

/*新建数据源文件*/
const OnShowSaveDialog = async () => {
  if (newDataSourceRef.selectedDataSource == 1) {
    let opt = defaultOpenDialogOptions
    opt.title = '新建数据库'
    opt.defaultPath = 'easy_pass'
    opt.filters = [{name: 'Sqlite File', extensions: ['sqlite']}]
    opt.properties.openDirectory = true
    const res = await showAppSaveDialog(opt)
    if (res != null) {
      newDataSourceRef.sqliteModel.filePath = res
      await formRef.sqliteRef.value.validateFields('filePath')
    }

  }
}

/*测试连接*/
const onDataSourceTest = async () => {
  newDataSourceRef.test.isTesting = true
  let result = null
  if (newDataSourceRef.selectedDataSource == 1) {
    await formRef.sqliteRef.value.validate().then(async () => {
      result = await dataSourceTest(
          newDataSourceRef.selectedDataSource,
          {dialect: 'sqlite', storage: newDataSourceRef.sqliteModel.filePath})
    }).catch((e) => {
      newDataSourceRef.test.isTesting = false
      return null
    })
  } else if (newDataSourceRef.selectedDataSource == 2) {
    await formRef.mysqlRef.value.validate().then(async () => {
      result = await dataSourceTest(
          newDataSourceRef.selectedDataSource,
          {
            database: newDataSourceRef.mysqlModel.database,
            username: newDataSourceRef.mysqlModel.username,
            password: newDataSourceRef.mysqlModel.password,
            host: newDataSourceRef.mysqlModel.hostname,
            port: newDataSourceRef.mysqlModel.port,
            dialect: 'mysql'
          })
    }).catch((e) => {
      newDataSourceRef.test.isTesting = false
      return null
    })
  }

  newDataSourceRef.test.isTesting = false
  /*结果处理*/
  if (result != null) {
    if (result.data.success) {
      newDataSourceRef.test.isSuccess = true
      newDataSourceRef.test.result.title = result.data.message
    } else {
      newDataSourceRef.test.isSuccess = false
      newDataSourceRef.test.result.title = result.data.message
      newDataSourceRef.test.result.content = result.data.result.message
    }
    newDataSourceRef.test.result.showResult = true
    newDataSourceRef.test.result.visible = true
  }

}

/*关闭时清空表单*/
watch(() => newDataSourceRef.modalVisible, (value) => {
  if (!value) {
    formRef.sqliteRef.value?.resetFields()
    formRef.mysqlRef.value?.resetFields()
    newDataSourceRef.test = {
      isTesting: false,
      isSuccess: false,
      result: {
        showResult: false,
        visible: false,
        title: '',
        content: ''
      }
    }
  }
})

const getDbIcon = (type: number) => {
  if (type == 1)
    return sqlite
  else if (type == 2)
    return mysql
}

</script>

<template>
  <!--  顶部按钮栏 -->
  <a-layout-header id="tool-header">
    <a-space style="gap: 4px">
      <!--新增 -->
      <a-button class="tool-btn" type="text" size="large" @click="onShowDataSourceModal" title="新增">
        <template #icon>
          <PlusOutlined/>
        </template>
        新增
      </a-button>
    </a-space>
    <!--右侧-->
    <a-space style="float: right">
      <!--刷新-->
      <a-button class="tool-btn" type="text" size="large" @click="searchDataSourceList">
        <template #icon>
          <reload-outlined :spin="refreshSpin"/>
        </template>
        刷新
      </a-button>
      <a-button class="tool-btn" type="text" size="large">
        <template #icon>
          <MoreOutlined/>
        </template>
      </a-button>
    </a-space>
  </a-layout-header>
  <!--列表-->
  <a-layout-content id="content-view">
    <a-spin :spinning="spinning">
      <a-row :gutter="16">
        <a-col
            v-for="(ds) in dataSourceList"
            :span="24"
            @mouseover="ds.isHover = true"
            @mouseout="ds.isHover = false"
            style="margin-bottom: 15px"
        >
          <a-card :bordered="false"
                  :hoverable="true"
                  size="large"
                  class="ds-card animate__animated animate__flipInX"
                  style=""
          >
            <a-row :gutter="20">
              <a-col>
                <a-image
                    :width="80"
                    :height="80"

                    :preview="false"
                    :src="getDbIcon(ds.type)"
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                />
              </a-col>
              <a-col>
                <a-row :gutter="12">
                  <a-col>
                    <a-typography-title :level="4"> {{ ds.name }}</a-typography-title>
                  </a-col>
                  <a-col v-if="isEqual(currentDSId,ds.id)">
                    <a-tag color="#2db7f5" style="margin-top: 0.3em;">当前数据源</a-tag>
                  </a-col>
                  <a-col v-else>
                    <a-button color="#2db7f5" size="small" style="margin-top: 0.3em;" @click="onChangeDataSource">
                      切换至此数据源
                    </a-button>
                  </a-col>
                </a-row>
                <a-row style="margin-top: 17px">
                  <a-typography>数据库类型：{{ dialectFormat(ds.dialect) }}</a-typography>
                </a-row>
              </a-col>
            </a-row>
            <div v-if="isEqual(ds.type,1)" style="margin:12px 0  0 24px;">
              <a-row>
                <a-col>
                  <SecondaryText>
                    <template #text>存储位置：</template>
                  </SecondaryText>
                </a-col>
                <a-col>
                  <SecondaryText>
                    <template #text>{{ ds.storage }}</template>
                  </SecondaryText>
                </a-col>
              </a-row>
              <a-row>
                <a-col>
                  <SecondaryText>
                    <template #text>存储空间：</template>
                  </SecondaryText>
                </a-col>
                <a-col>
                  <SecondaryText>
                    <template #text>1GB</template>
                  </SecondaryText>
                </a-col>
              </a-row>
            </div>
            <div v-if="isEqual(ds.type,2)" style="margin:12px 0  0 24px;">
              <!--              <a-row>
                              <a-col>
                                <SecondaryText>
                                  <template #text>存储位置：</template>
                                </SecondaryText>
                              </a-col>
                              <a-col>
                                <SecondaryText>
                                  <template #text>{{ ds.storage }}</template>
                                </SecondaryText>
                              </a-col>
                            </a-row>
                            <a-row>
                              <a-col>
                                <SecondaryText>
                                  <template #text>存储空间：</template>
                                </SecondaryText>
                              </a-col>
                              <a-col>
                                <SecondaryText>
                                  <template #text>1GB</template>
                                </SecondaryText>
                              </a-col>
                            </a-row>-->
            </div>
            <close-outlined
                v-show="ds.isHover"
                @click="onDeleteDataSource"
                class="close-btn"
                style="" title="删除"/>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </a-layout-content>

  <!--新增弹出框-->
  <a-modal
      v-model:visible=" newDataSourceRef.modalVisible"
      :closable="true"
      :mask-closable="false"
      title="新增数据源"
      width="62%"
      @ok="onAddDataSource"
      class="add-modal"
  >
    <div style="max-height: 280px;overflow-y: auto">
      <a-row>
        <a-space>
          <span>数据源类型：</span>
          <a-select
              ref="select"
              v-model:value="newDataSourceRef.selectedDataSource"
              style="width: 180px"
              @focus="focus"
          >
            <a-select-option :value="1">SQLite</a-select-option>
            <a-select-option :value="2">MySQL</a-select-option>
            <a-select-option :value="4">MariaDB</a-select-option>
            <a-select-option :value="5">Microsoft SQL Server</a-select-option>
            <a-select-option :value="3">Postgres</a-select-option>
          </a-select>
        </a-space>
      </a-row>
      <a-divider style="margin-top: 12px;"/>
      <div style="margin-left: 14px;">
        <a-row v-if="isEqual(newDataSourceRef.selectedDataSource,1)">
          <a-row :gutter="50">
            <a-col>驱动程序:
              <a-typography-text code>SQLite3 v5.1.2</a-typography-text>
            </a-col>
            <a-col>默认架构名:
              <a-typography-text code>main</a-typography-text>
            </a-col>
          </a-row>
          <a-row style="margin-top: 20px">
            <a-col>
              <a-form
                  :ref="formRef.sqliteRef"
                  :model="newDataSourceRef.sqliteModel"
                  :label-col="{span:3}"
                  labelAlign="left"
                  style="width: 470px"
              >
                <a-form-item label="名称" name="name"
                             :rules="[{ required: true, message: '名称不可为空' },{max:24,message: '最大长度为24'}]">
                  <a-input v-model:value="newDataSourceRef.sqliteModel.name" allowClear
                           :title="newDataSourceRef.sqliteModel.name"/>
                </a-form-item>
                <a-form-item label="文件" name="filePath" :rules="[{ required: true, message: '路径不可为空' }]">
                  <a-input-group compact>
                    <a-input style="width: 80%;" v-model:value="newDataSourceRef.sqliteModel.filePath" allowClear
                             :title="newDataSourceRef.sqliteModel.filePath"/>
                    <a-button style="width: 10%;" title="打开">
                      <ellipsis-outlined @click="OnShowOpenDialog"/>
                    </a-button>
                    <a-button style="width: 10%;" title="新建">
                      <plus-outlined @click="OnShowSaveDialog"/>
                    </a-button>
                  </a-input-group>
                </a-form-item>
              </a-form>
            </a-col>
          </a-row>
        </a-row>
        <a-row v-if="isEqual(newDataSourceRef.selectedDataSource,2)">
          <a-row :gutter="50">
            <a-col>驱动程序:
              <a-typography-text code>MySql2 v2.3.3</a-typography-text>
            </a-col>
          </a-row>
          <a-row style="margin-top: 20px">
            <a-col>
              <a-form
                  :ref="formRef.mysqlRef"
                  :model="newDataSourceRef.mysqlModel"
                  labelAlign="left"
                  style="width: 470px"
              >
                <a-row>
                  <a-col :span="24">
                    <a-form-item label="名称" name="name" :label-col="{span:4}" :wrapper-col="{span:20}"
                                 :rules="[{ required: true, message: '名称不可为空' },{max:24,message: '最大长度为24'}]">
                      <a-input
                          v-model:value="newDataSourceRef.mysqlModel.name"
                          :title="newDataSourceRef.mysqlModel.name"
                          allowClear/>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="2">
                  <a-col :span="16">
                    <a-form-item label="主机名" name="hostname" :label-col="{span:5}" :wrapper-col="{span:16,offset:1}"
                                 :rules="[{ required: true, message: '主机名不可为空' }]">
                      <a-input
                          v-model:value="newDataSourceRef.mysqlModel.hostname"
                          :title="newDataSourceRef.mysqlModel.hostname"
                          allowClear
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="端口" name="port" :wrapper-col="{offset:2}"
                                 :rules="[{ required: true, message: '端口号不可为空' }]">
                      <a-input-number v-model:value="newDataSourceRef.mysqlModel.port" :min="0"/>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="24">
                    <a-form-item label="用户名" name="username" :label-col="{span:4}" :wrapper-col="{span:20}"
                                 :rules="[{ required: true, message: '用户名不可为空' }]">
                      <a-input
                          v-model:value="newDataSourceRef.mysqlModel.username"
                          :title="newDataSourceRef.mysqlModel.username"
                          allowClear
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="24">
                    <a-form-item label="密码" name="password" :label-col="{span:4}" :wrapper-col="{span:20}"
                                 :rules="[{ required: true, message: '密码不可为空' }]">
                      <a-input-password
                          v-model:value="newDataSourceRef.mysqlModel.password"
                          :title="newDataSourceRef.mysqlModel.password"
                          allowClear
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="24">
                    <a-form-item label="数据库" name="database" :label-col="{span:4}" :wrapper-col="{span:20}"
                                 :rules="[{ required: true, message: '数据库名不可为空' }]">
                      <a-input
                          v-model:value="newDataSourceRef.mysqlModel.database"
                          :title="newDataSourceRef.mysqlModel.database"
                          allowClear
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </a-col>
          </a-row>
        </a-row>
      </div>
    </div>

    <template #footer>
      <a-space style="float: left">
        <a-button type="link" @click="onDataSourceTest">测试连接</a-button>
        <loading-outlined v-if="newDataSourceRef.test.isTesting"/>
        <check-outlined class="success-icon"
                        v-if="!isEmpty( newDataSourceRef.test.result.title) && newDataSourceRef.test.isSuccess"/>
        <exclamation-circle-outlined class="warn-icon"
                                     v-if="!isEmpty( newDataSourceRef.test.result.title) && !newDataSourceRef.test.isSuccess"/>
        <a-popover v-if="newDataSourceRef.test.result.showResult" :visible="newDataSourceRef.test.result.visible">
          <template #content v-if="!isEmpty(newDataSourceRef.test.result.content)">
            <a-space>
              {{ newDataSourceRef.test.result.content }}
              <close-outlined @click="newDataSourceRef.test.result.visible=false"/>
            </a-space>

          </template>
          <span @click="newDataSourceRef.test.result.visible=true">{{ newDataSourceRef.test.result.title }}</span>
        </a-popover>
      </a-space>
      <a-button @click="newDataSourceRef.modalVisible = false">取消</a-button>
      <a-button type="primary" @click="onAddDataSource" :loading="newDataSourceRef.loading">确定</a-button>
    </template>
  </a-modal>
</template>

<style scoped lang="less">
@import "ant-design-vue/dist/antd.variable.less";

#tool-header {
  :deep(.tool-btn):hover {
    background-color: @primary-1;
  }
}

#content-view {
  overflow-x: hidden;

  :deep(.ant-card-body) {
    padding: 12px;
  }
}

.ds-card {
  padding: 0;
  border-radius: 5px;

  .close-btn {
    position: absolute;
    right: 1%;
    top: 3%;
    font-size: 15px;
  }
}

.add-modal {
  .success-icon {
    color: @success-color-active;
  }

  .warn-icon {
    color: @warning-color-active;
  }
}
</style>
