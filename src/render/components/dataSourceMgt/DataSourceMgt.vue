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
import {
  saveOrUpdateDataSource,
  appRelaunch,
  changeDataSource,
  deleteDataSource,
  getAppDbStat,
  getDataSourceList
} from "@render/api/app.api";
import {FormInstance, message, Modal} from "ant-design-vue";
import {cloneDeep, isEmpty, isEqual} from "lodash-es";
import SecondaryText from "@render/components/settings/SecondaryText.vue";
import {defaultOpenDialogOptions, showAppOpenDialog, showAppSaveDialog} from "@render/utils/fileDialog";
import sqliteIcon from '@render/assets/img/db/sqlite.png'
import mysqlIcon from '@render/assets/img/db/mysql.png'
import mariadbIcon from '@render/assets/img/db/mariadb.png'
import mssqlIcon from '@render/assets/img/db/sql_server.png'
import {dataSourceTest} from "@render/api/utils.api";
import {uuid} from "vue3-uuid";

// region 数据源列表
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

/*当前选择的数据源*/
let currentDSId = ref()

onMounted(async () => {
  await onRefresh()
})

/*查询数据源*/
const searchDataSourceList = async () => {
  spinning.value = true
  refreshSpinning()

  await getDataSourceList().then(res => {
    if (res.data.success) {
      dataSourceList.value = res.data.result
      dataSourceList.value.forEach(ds => {
        ds.isHover = false
      })
    } else {
      message.error(res.data.message)
    }
  }).then(() => {
    spinning.value = false
  })
}

/*刷新或重载*/
const onRefresh = async () => {
  /*当前数据源ID*/
  currentDSId.value = (await getAppDbStat()).data.result.currentDSId
  await searchDataSourceList()
  let currentDS = dataSourceList.value.filter(ds => isEqual(ds.id, currentDSId.value)).at(0);
  //过滤掉选中的数据源
  dataSourceList.value = cloneDeep(dataSourceList.value.filter(ds => !isEqual(ds.id, currentDSId.value)));
  dataSourceList.value.unshift(currentDS)
}

/*切换数据源*/
const onChangeDataSource = (id: string) => {
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: '是否切换至此数据源？',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      changeDataSource(id).then(async res => {
        if (res.data.success) {
          message.success(res.data.message)
          await onRefresh()
        } else {
          message.warn(res.data.message)
        }
        Modal.confirm({
          title: '提示',
          icon: createVNode(ExclamationCircleOutlined),
          content: '是否立即重启应用生效？',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            appRelaunch()
          }
        })
      })
    },
  });
}

/*新增数据源*/
const onSubmitDSForm = () => {
  dataSourceEditModalRef.loading = true

  switch (dataSourceEditModalRef.selectedDataSource) {
    case 1:
      /*sqlite*/
      formRef.sqliteRef.value.validate().then(() => {
        const opt = {
          id: dataSourceEditModalRef.sqliteModel.id == null ? uuid.v1() : dataSourceEditModalRef.sqliteModel.id,
          type: 1,
          name: dataSourceEditModalRef.sqliteModel.name,
          dialect: 'sqlite',
          storage: dataSourceEditModalRef.sqliteModel.filePath,
        }
        saveOrUpdateDataSource(opt).then(res => {
          if (res.data.success) {
            message.success(res.data.message)
            onRefresh()
          } else {
            message.error(res.data.message)
          }
        }).then(() => {
          dataSourceEditModalRef.modalVisible = false
          dataSourceEditModalRef.loading = false
        })
      }).catch(e => {
        console.log(e)
        dataSourceEditModalRef.loading = false
      })
      break
    case 2:
      /*mysql*/
      formRef.mysqlRef.value.validate().then(() => {
        let opt = cloneDeep(dataSourceEditModalRef.mysqlModel) as any
        opt.id = dataSourceEditModalRef.mysqlModel.id == null ? uuid.v1() : dataSourceEditModalRef.mysqlModel.id
        opt.type = 2
        opt.dialect = 'mysql'
        saveOrUpdateDataSource(opt).then(res => {
          if (res.data.success) {
            message.success(res.data.message)
            onRefresh()
          } else {
            message.error(res.data.message)
          }
        }).then(() => {
          dataSourceEditModalRef.modalVisible = false
          dataSourceEditModalRef.loading = false
        })
      }).catch(e => {
        console.log(e)
        dataSourceEditModalRef.loading = false
      })
      break
    case 3:
      /*mariadb*/
      formRef.mariaDbRef.value.validate().then(() => {
        let opt = cloneDeep(dataSourceEditModalRef.mariaDbModel) as any
        opt.id = dataSourceEditModalRef.mariaDbModel.id == null ? uuid.v1() : dataSourceEditModalRef.mariaDbModel.id
        opt.type = 3
        opt.dialect = 'mariadb'
        saveOrUpdateDataSource(opt).then(res => {
          if (res.data.success) {
            message.success(res.data.message)
            onRefresh()
          } else {
            message.error(res.data.message)
          }
        }).then(() => {
          dataSourceEditModalRef.modalVisible = false
          dataSourceEditModalRef.loading = false
        })
      }).catch(e => {
        console.log(e)
        dataSourceEditModalRef.loading = false
      })
      break
    case 4:
      /*mssql*/
      formRef.mssqlRef.value.validate().then(() => {
        let opt = cloneDeep(dataSourceEditModalRef.mssqlModel) as any
        opt.id = dataSourceEditModalRef.mssqlModel.id == null ? uuid.v1() : dataSourceEditModalRef.mssqlModel.id
        opt.type = 4
        opt.dialect = 'mssql'
        saveOrUpdateDataSource(opt).then(res => {
          if (res.data.success) {
            message.success(res.data.message)
            onRefresh()
          } else {
            message.error(res.data.message)
          }
        }).then(() => {
          dataSourceEditModalRef.modalVisible = false
          dataSourceEditModalRef.loading = false
        })
      }).catch(e => {
        console.log(e)
        dataSourceEditModalRef.loading = false
      })
      break
  }
}

/*删除数据源*/
const onDeleteDataSource = (id: string) => {
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: '是否删除此数据源？',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      deleteDataSource(id).then(res => {
        if (res.data.success) {
          message.success(res.data.message)
          onRefresh()
        } else
          message.warn(res.data.message)
      })
    }
  })
}

/*数据源类型格式化*/
const dialectFormat = (type) => {
  if (isEqual(type, 1))
    return 'SQLite'
  else if (isEqual(type, 2))
    return 'MySQL'
  else if (isEqual(type, 3))
    return 'MariaDB'
  else if (isEqual(type, 4))
    return 'SQL Server'
}

/*设置数据源图标*/
const getDbIcon = (type: number) => {
  if (type == 1)
    return sqliteIcon
  else if (type == 2)
    return mysqlIcon
  else if (type == 3)
    return mariadbIcon
  else if (type == 4)
    return mssqlIcon
}

//endregion

//region 新增数据源弹框

/*表单Ref*/
const formRef = {
  sqliteRef: ref<FormInstance>(),
  mysqlRef: ref<FormInstance>(),
  mariaDbRef: ref<FormInstance>(),
  mssqlRef: ref<FormInstance>(),
}

/*新增数据源Ref*/
const dataSourceEditModalRef = reactive({
  modalVisible: false,
  isUpdate: false,
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
    id: null,
    name: '',
    filePath: ''
  },
  mysqlModel: {
    id: null,
    name: '',
    hostname: '',
    port: 3306,
    username: '',
    password: '',
    database: ''
  },
  mariaDbModel: {
    id: null,
    name: '',
    hostname: '',
    port: 3306,
    username: '',
    password: '',
    database: ''
  },
  mssqlModel: {
    id: null,
    name: '',
    hostname: '',
    port: 1433,
    username: '',
    password: '',
    database: ''
  }
})

/*更新数据源弹出框显示*/
const onEdit = (ds: any) => {
  dataSourceEditModalRef.modalVisible = true
  dataSourceEditModalRef.selectedDataSource = ds.type
  dataSourceEditModalRef.isUpdate = true
  switch (ds.type) {
    case 1:
      dataSourceEditModalRef.sqliteModel.id = ds.id
      dataSourceEditModalRef.sqliteModel.name = ds.name
      dataSourceEditModalRef.sqliteModel.filePath = ds.storage
      break
    case 2:
      dataSourceEditModalRef.mysqlModel.id = ds.id
      dataSourceEditModalRef.mysqlModel.name = ds.name
      dataSourceEditModalRef.mysqlModel.hostname = ds.hostname
      dataSourceEditModalRef.mysqlModel.port = ds.port
      dataSourceEditModalRef.mysqlModel.username = ds.username
      dataSourceEditModalRef.mysqlModel.password = ds.password
      dataSourceEditModalRef.mysqlModel.database = ds.database
      break
    case 3:
      dataSourceEditModalRef.mariaDbModel.id = ds.id
      dataSourceEditModalRef.mariaDbModel.name = ds.name
      dataSourceEditModalRef.mariaDbModel.hostname = ds.hostname
      dataSourceEditModalRef.mariaDbModel.port = ds.port
      dataSourceEditModalRef.mariaDbModel.username = ds.username
      dataSourceEditModalRef.mariaDbModel.password = ds.password
      dataSourceEditModalRef.mariaDbModel.database = ds.database
      break
    case 4:
      dataSourceEditModalRef.mssqlModel.id = ds.id
      dataSourceEditModalRef.mssqlModel.name = ds.name
      dataSourceEditModalRef.mssqlModel.hostname = ds.hostname
      dataSourceEditModalRef.mssqlModel.port = ds.port
      dataSourceEditModalRef.mssqlModel.username = ds.username
      dataSourceEditModalRef.mssqlModel.password = ds.password
      dataSourceEditModalRef.mssqlModel.database = ds.database
      break
  }
}

/*新增数据源框显示*/
const onShowDataSourceModal = () => {
  dataSourceEditModalRef.sqliteModel = {
    id: null,
    name: '',
    filePath: ''
  }
  dataSourceEditModalRef.mysqlModel = {
    id: null,
    name: '',
    hostname: '',
    port: 3306,
    username: '',
    password: '',
    database: ''
  }
  dataSourceEditModalRef.mariaDbModel = {
    id: null,
    name: '',
    hostname: '',
    port: 3306,
    username: '',
    password: '',
    database: ''
  }
  dataSourceEditModalRef.mssqlModel = {
    id: null,
    name: '',
    hostname: '',
    port: 1433,
    username: '',
    password: '',
    database: ''
  }
  dataSourceEditModalRef.modalVisible = true
  dataSourceEditModalRef.isUpdate = false
}

/*打开数据源文件*/
const OnShowOpenDialog = async () => {
  if (dataSourceEditModalRef.selectedDataSource == 1) {
    let opt = defaultOpenDialogOptions
    opt.title = '选择数据库'
    opt.filters = [{name: 'Sqlite File', extensions: ['sqlite']}]
    const res = await showAppOpenDialog(opt)
    if (res != null) {
      dataSourceEditModalRef.sqliteModel.filePath = res.at(0)
      await formRef.sqliteRef.value.validateFields('filePath')
    }
  }
}

/*新建数据源文件*/
const OnShowSaveDialog = async () => {
  if (dataSourceEditModalRef.selectedDataSource == 1) {
    let opt = defaultOpenDialogOptions
    opt.title = '新建数据库'
    opt.defaultPath = 'easy_pass'
    opt.filters = [{name: 'Sqlite File', extensions: ['sqlite']}]
    opt.properties.openDirectory = true
    const res = await showAppSaveDialog(opt)
    if (res != null) {
      dataSourceEditModalRef.sqliteModel.filePath = res
      await formRef.sqliteRef.value.validateFields('filePath')
    }
  }
}

/*测试连接*/
const onDataSourceTest = async () => {
  dataSourceEditModalRef.test.isTesting = true
  /*结果初始化*/
  dataSourceEditModalRef.test.result = {
    showResult: false,
    visible: false,
    title: '',
    content: ''
  }

  let result = null

  switch (dataSourceEditModalRef.selectedDataSource) {

    case 1:
      /*sqlite*/
      await formRef.sqliteRef.value.validate().then(async () => {
        result = await dataSourceTest(
            dataSourceEditModalRef.selectedDataSource,
            {dialect: 'sqlite', storage: dataSourceEditModalRef.sqliteModel.filePath})
      }).catch((e) => {
        dataSourceEditModalRef.test.isTesting = false
        return null
      })
      break
    case 2:
      /*mysql*/
      await formRef.mysqlRef.value.validate().then(async () => {
        result = await dataSourceTest(
            dataSourceEditModalRef.selectedDataSource,
            {
              database: dataSourceEditModalRef.mysqlModel.database,
              username: dataSourceEditModalRef.mysqlModel.username,
              password: dataSourceEditModalRef.mysqlModel.password,
              host: dataSourceEditModalRef.mysqlModel.hostname,
              port: dataSourceEditModalRef.mysqlModel.port,
              dialect: 'mysql'
            })
      }).catch((e) => {
        dataSourceEditModalRef.test.isTesting = false
        return null
      })
      break
    case 3:
      /*mariadb*/
      await formRef.mariaDbRef.value.validate().then(async () => {
        result = await dataSourceTest(
            dataSourceEditModalRef.selectedDataSource,
            {
              database: dataSourceEditModalRef.mariaDbModel.database,
              username: dataSourceEditModalRef.mariaDbModel.username,
              password: dataSourceEditModalRef.mariaDbModel.password,
              host: dataSourceEditModalRef.mariaDbModel.hostname,
              port: dataSourceEditModalRef.mariaDbModel.port,
              dialect: 'mariadb'
            })
      }).catch((e) => {
        dataSourceEditModalRef.test.isTesting = false
        return null
      })
      break
    case 4:
      /*mssql*/
      await formRef.mssqlRef.value.validate().then(async () => {
        result = await dataSourceTest(
            dataSourceEditModalRef.selectedDataSource,
            {
              database: dataSourceEditModalRef.mssqlModel.database,
              username: dataSourceEditModalRef.mssqlModel.username,
              password: dataSourceEditModalRef.mssqlModel.password,
              host: dataSourceEditModalRef.mssqlModel.hostname,
              port: dataSourceEditModalRef.mssqlModel.port,
              dialect: 'mssql'
            })
      }).catch((e) => {
        dataSourceEditModalRef.test.isTesting = false
        return null
      })
      break
  }
  dataSourceEditModalRef.test.isTesting = false
  /*结果处理*/
  if (result != null) {
    if (result.data.success) {
      dataSourceEditModalRef.test.isSuccess = true
      dataSourceEditModalRef.test.result.title = result.data.message
    } else {
      dataSourceEditModalRef.test.isSuccess = false
      dataSourceEditModalRef.test.result.title = result.data.message
      dataSourceEditModalRef.test.result.content = result.data.result.message
    }
    dataSourceEditModalRef.test.result.showResult = true
    dataSourceEditModalRef.test.result.visible = true
  }
}

/*关闭时重置测试功能*/
watch(() => dataSourceEditModalRef.modalVisible, (value) => {
  if (!value) {
    dataSourceEditModalRef.test = {
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

//endregion

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
      <a-button class="tool-btn" type="text" size="large" @click="onRefresh">
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
              <a-col :span="24">
                <a-row :gutter="12">
                  <a-col>
                    <a-avatar :src="getDbIcon(ds.type)" shape="square"></a-avatar>
                  </a-col>
                  <a-col>
                    <a-typography-title :level="4"> {{ ds.name }}</a-typography-title>
                  </a-col>
                  <a-col v-if="isEqual(currentDSId,ds.id)">
                    <a-divider type="vertical"/>
                    <a-tag color="#2db7f5" style="margin-top: 0.3em;">当前数据源</a-tag>
                  </a-col>
                </a-row>
                <a-row style="margin-top: 2px">
                  <a-col :span="24">
                    <SecondaryText style="line-height: 2.5em">
                      <template #text>数据库类型：{{ dialectFormat(ds.type) }}</template>
                    </SecondaryText>
                    <div style="float: right;">
                      <template v-if="!isEqual(currentDSId,ds.id)">
                        <a-button type="link" @click="onChangeDataSource(ds.id)">
                          切换至此数据源
                        </a-button>
                        <a-divider type="vertical" style="margin: 0"/>
                      </template>
                      <a-button type="link" @click="onEdit(ds)">编辑</a-button>
                    </div>

                  </a-col>
                </a-row>
              </a-col>
            </a-row>

            <!--删除按钮-->
            <close-outlined
                v-show="ds.isHover && !isEqual(currentDSId,ds.id)"
                @click="onDeleteDataSource(ds.id)"
                class="close-btn"
                title="删除"/>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </a-layout-content>

  <!--新增或更新弹出框-->
  <a-modal
      v-model:visible="dataSourceEditModalRef.modalVisible"
      :closable="true"
      :mask-closable="false"
      :title="dataSourceEditModalRef.isUpdate?'编辑数据源':'新增数据源'"
      width="62%"
      class="add-modal"
  >
    <div style="max-height: 280px;overflow-y: auto">
      <a-row>
        <a-space>
          <span>数据源类型：</span>
          <a-select
              ref="select"
              v-model:value="dataSourceEditModalRef.selectedDataSource"
              style="width: 180px"
              @focus="focus"
          >
            <a-select-option :value="1">SQLite</a-select-option>
            <a-select-option :value="2">MySQL</a-select-option>
            <a-select-option :value="3">MariaDB</a-select-option>
            <a-select-option :value="4">SQL Server</a-select-option>
          </a-select>
        </a-space>
      </a-row>
      <a-divider style="margin-top: 12px;"/>
      <div style="margin-left: 14px;">
        <!--sqlite-->
        <a-row v-if="isEqual(dataSourceEditModalRef.selectedDataSource,1)">
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
                  :model="dataSourceEditModalRef.sqliteModel"
                  :label-col="{span:3}"
                  labelAlign="left"
                  style="width: 470px"
              >
                <a-form-item label="名称" name="name"
                             :rules="[{ required: true, message: '名称不可为空' },{max:24,message: '最大长度为24'}]">
                  <a-input v-model:value="dataSourceEditModalRef.sqliteModel.name" allowClear
                           :title="dataSourceEditModalRef.sqliteModel.name"/>
                </a-form-item>
                <a-form-item label="文件" name="filePath" :rules="[{ required: true, message: '路径不可为空' }]">
                  <a-input-group compact>
                    <a-input style="width: 80%;" v-model:value="dataSourceEditModalRef.sqliteModel.filePath" allowClear
                             :title="dataSourceEditModalRef.sqliteModel.filePath"/>
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
        <!--mysql-->
        <a-row v-if="isEqual(dataSourceEditModalRef.selectedDataSource,2)">
          <a-row :gutter="50">
            <a-col>驱动程序:
              <a-typography-text code>MySql2 v2.3.3</a-typography-text>
            </a-col>
          </a-row>
          <a-row style="margin-top: 20px">
            <a-col>
              <a-form
                  :ref="formRef.mysqlRef"
                  :model="dataSourceEditModalRef.mysqlModel"
                  labelAlign="left"
                  style="width: 470px"
              >
                <a-row>
                  <a-col :span="24">
                    <a-form-item label="名称" name="name" :label-col="{span:4}" :wrapper-col="{span:20}"
                                 :rules="[{ required: true, message: '名称不可为空' },{max:24,message: '最大长度为24'}]">
                      <a-input
                          v-model:value="dataSourceEditModalRef.mysqlModel.name"
                          :title="dataSourceEditModalRef.mysqlModel.name"
                          allowClear/>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="2">
                  <a-col :span="16">
                    <a-form-item label="主机名" name="hostname" :label-col="{span:5}" :wrapper-col="{span:16,offset:1}"
                                 :rules="[{ required: true, message: '主机名不可为空' }]">
                      <a-input
                          v-model:value="dataSourceEditModalRef.mysqlModel.hostname"
                          :title="dataSourceEditModalRef.mysqlModel.hostname"
                          allowClear
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="端口" name="port" :wrapper-col="{offset:2}"
                                 :rules="[{ required: true, message: '端口号不可为空' }]">
                      <a-input-number v-model:value="dataSourceEditModalRef.mysqlModel.port" :min="0"/>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="24">
                    <a-form-item label="用户名" name="username" :label-col="{span:4}" :wrapper-col="{span:20}"
                                 :rules="[{ required: true, message: '用户名不可为空' }]">
                      <a-input
                          v-model:value="dataSourceEditModalRef.mysqlModel.username"
                          :title="dataSourceEditModalRef.mysqlModel.username"
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
                          v-model:value="dataSourceEditModalRef.mysqlModel.password"
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
                          v-model:value="dataSourceEditModalRef.mysqlModel.database"
                          :title="dataSourceEditModalRef.mysqlModel.database"
                          allowClear
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </a-col>
          </a-row>
        </a-row>
        <!--mariadb-->
        <a-row v-if="isEqual(dataSourceEditModalRef.selectedDataSource,3)">
          <a-row :gutter="50">
            <a-col>驱动程序:
              <a-typography-text code>MariaDB v3.0.2</a-typography-text>
            </a-col>
          </a-row>
          <a-row style="margin-top: 20px">
            <a-col>
              <a-form
                  :ref="formRef.mariaDbRef"
                  :model="dataSourceEditModalRef.mariaDbModel"
                  labelAlign="left"
                  style="width: 470px"
              >
                <a-row>
                  <a-col :span="24">
                    <a-form-item label="名称" name="name" :label-col="{span:4}" :wrapper-col="{span:20}"
                                 :rules="[{ required: true, message: '名称不可为空' },{max:24,message: '最大长度为24'}]">
                      <a-input
                          v-model:value="dataSourceEditModalRef.mariaDbModel.name"
                          :title="dataSourceEditModalRef.mariaDbModel.name"
                          allowClear/>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="2">
                  <a-col :span="16">
                    <a-form-item label="主机名" name="hostname" :label-col="{span:5}" :wrapper-col="{span:16,offset:1}"
                                 :rules="[{ required: true, message: '主机名不可为空' }]">
                      <a-input
                          v-model:value="dataSourceEditModalRef.mariaDbModel.hostname"
                          :title="dataSourceEditModalRef.mariaDbModel.hostname"
                          allowClear
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="端口" name="port" :wrapper-col="{offset:2}"
                                 :rules="[{ required: true, message: '端口号不可为空' }]">
                      <a-input-number v-model:value="dataSourceEditModalRef.mariaDbModel.port" :min="0"/>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="24">
                    <a-form-item label="用户名" name="username" :label-col="{span:4}" :wrapper-col="{span:20}"
                                 :rules="[{ required: true, message: '用户名不可为空' }]">
                      <a-input
                          v-model:value="dataSourceEditModalRef.mariaDbModel.username"
                          :title="dataSourceEditModalRef.mariaDbModel.username"
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
                          v-model:value="dataSourceEditModalRef.mariaDbModel.password"
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
                          v-model:value="dataSourceEditModalRef.mariaDbModel.database"
                          :title="dataSourceEditModalRef.mariaDbModel.database"
                          allowClear
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </a-col>
          </a-row>
        </a-row>
        <!--mssql-->
        <a-row v-if="isEqual(dataSourceEditModalRef.selectedDataSource,4)">
          <a-row :gutter="50">
            <a-col>驱动程序:
              <a-typography-text code>Tedious v15.1.2</a-typography-text>
            </a-col>
          </a-row>
          <a-row style="margin-top: 20px">
            <a-col>
              <a-form
                  :ref="formRef.mssqlRef"
                  :model="dataSourceEditModalRef.mssqlModel"
                  labelAlign="left"
                  style="width: 470px"
              >
                <a-row>
                  <a-col :span="24">
                    <a-form-item label="名称" name="name" :label-col="{span:4}" :wrapper-col="{span:20}"
                                 :rules="[{ required: true, message: '名称不可为空' },{max:24,message: '最大长度为24'}]">
                      <a-input
                          v-model:value="dataSourceEditModalRef.mssqlModel.name"
                          :title="dataSourceEditModalRef.mssqlModel.name"
                          allowClear/>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="2">
                  <a-col :span="16">
                    <a-form-item label="主机名" name="hostname" :label-col="{span:5}" :wrapper-col="{span:16,offset:1}"
                                 :rules="[{ required: true, message: '主机名不可为空' }]">
                      <a-input
                          v-model:value="dataSourceEditModalRef.mssqlModel.hostname"
                          :title="dataSourceEditModalRef.mssqlModel.hostname"
                          allowClear
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="端口" name="port" :wrapper-col="{offset:2}"
                                 :rules="[{ required: true, message: '端口号不可为空' }]">
                      <a-input-number v-model:value="dataSourceEditModalRef.mssqlModel.port" :min="0"/>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="24">
                    <a-form-item label="用户名" name="username" :label-col="{span:4}" :wrapper-col="{span:20}"
                                 :rules="[{ required: true, message: '用户名不可为空' }]">
                      <a-input
                          v-model:value="dataSourceEditModalRef.mssqlModel.username"
                          :title="dataSourceEditModalRef.mssqlModel.username"
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
                          v-model:value="dataSourceEditModalRef.mssqlModel.password"
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
                          v-model:value="dataSourceEditModalRef.mssqlModel.database"
                          :title="dataSourceEditModalRef.mssqlModel.database"
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
        <loading-outlined v-if="dataSourceEditModalRef.test.isTesting"/>
        <check-outlined class="success-icon"
                        v-if="!isEmpty( dataSourceEditModalRef.test.result.title) && dataSourceEditModalRef.test.isSuccess"/>
        <exclamation-circle-outlined class="warn-icon"
                                     v-if="!isEmpty( dataSourceEditModalRef.test.result.title) && !dataSourceEditModalRef.test.isSuccess"/>
        <a-popover v-if="dataSourceEditModalRef.test.result.showResult"
                   :visible="dataSourceEditModalRef.test.result.visible">
          <template #content v-if="!isEmpty(dataSourceEditModalRef.test.result.content)">
            <a-space>
              {{ dataSourceEditModalRef.test.result.content }}
              <close-outlined @click="dataSourceEditModalRef.test.result.visible=false"/>
            </a-space>

          </template>
          <span @click="dataSourceEditModalRef.test.result.visible=true">{{
              dataSourceEditModalRef.test.result.title
            }}</span>
        </a-popover>
      </a-space>
      <a-button @click="dataSourceEditModalRef.modalVisible = false">取消</a-button>
      <a-button type="primary" @click="onSubmitDSForm" :loading="dataSourceEditModalRef.loading">确定</a-button>
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
  padding-top: 16px;

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
    top: 5%;
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
