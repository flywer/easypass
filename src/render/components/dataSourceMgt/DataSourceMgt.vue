<script setup lang="ts">
import {MoreOutlined, ReloadOutlined, CloseOutlined, PlusOutlined} from '@ant-design/icons-vue'
import {onMounted, reactive, ref} from "vue";
import {getDataSourceList} from "@render/api/app.api";
import {message} from "ant-design-vue";
import {isEqual} from "lodash-es";
import SecondaryText from "@render/components/settings/SecondaryText.vue";

//加载效果是否显示
const spinning = ref(false)
const databasesList = ref([])
//刷新动画
let refreshSpin = ref(false)
//刷新动画
const refreshSpinning = () => {
  refreshSpin.value = true
  setTimeout(() => {
    refreshSpin.value = false
  }, 1000)
}

onMounted(() => {
  searchDataSourceList()
})

const searchDataSourceList = () => {
  spinning.value = true
  refreshSpinning()

  getDataSourceList().then(res => {
    if (res.data.success) {
      databasesList.value = res.data.result
      databasesList.value.forEach(db => {
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

/*新增数据源Ref*/
const newDataSourceRef = reactive({
  modalVisible: false,
  selectedDataSource: '1'

})

/*新增数据源框显示*/
const onShowDataSourceModal = () => {
  newDataSourceRef.modalVisible = true
}

const onChangeDataSource = () => {
  if (newDataSourceRef.selectedDataSource) {

  }
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
            v-for="(db) in databasesList"
            :span="24"
            @mouseover="db.isHover = true"
            @mouseout="db.isHover = false"
            style="margin-bottom: 15px"
        >
          <a-card :bordered="false"
                  :hoverable="true"
                  size="large"
                  class="animate__animated animate__flipInX"
                  style="padding: 0;border-radius: 5px"
          >
            <a-row :gutter="20">
              <a-col>
                <a-image
                    :width="80"
                    :height="80"
                    :preview="false"
                    src="https://www.antdv.com/#error"
                    fallback="data:image/png;base64,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"
                />
              </a-col>
              <a-col>
                <a-row :gutter="12" align="center">
                  <a-col>
                    <a-typography-title :level="4"> {{ db.name }}</a-typography-title>
                  </a-col>
                  <a-col>
                    <a-tag color="#2db7f5" style="margin-top: 0.3em;">当前数据源</a-tag>
                  </a-col>
                </a-row>
                <a-row style="margin-top: 17px">
                  <a-typography>数据库类型：{{ dialectFormat(db.dialect) }}</a-typography>
                </a-row>
              </a-col>
            </a-row>
            <div v-if="isEqual(db.dialect,'sqlite')" style="margin:12px 0  0 24px;">
              <a-row>
                <a-col>
                  <SecondaryText>
                    <template #text>存储位置：</template>
                  </SecondaryText>
                </a-col>
                <a-col>
                  <SecondaryText>
                    <template #text>{{ db.storage }}</template>
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
            <close-outlined
                v-show="db.isHover"
                @click="onDeleteDataSource"
                style="position: absolute;right: 1%;top: 3%;font-size: 15px;"/>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </a-layout-content>

  <!--新增弹出框-->
  <a-modal
      v-model:visible=" newDataSourceRef.modalVisible"
      :closable="true"
      title="新增数据源"
      ok-text="确定"
      cancel-text="取消"
      width="60%"
  >
    <div>
      <a-row>
        <a-space>
          <span>数据源类型：</span>
          <a-select
              ref="select"
              v-model:value="newDataSourceRef.selectedDataSource"
              style="width: 180px"
              @focus="focus"
              @change="onChangeDataSource"
          >
            <a-select-option value="1">SQLite</a-select-option>
            <a-select-option value="2">MySQL</a-select-option>
            <a-select-option value="3">Postgres</a-select-option>
            <a-select-option value="4">MariaDB</a-select-option>
            <a-select-option value="5">Microsoft SQL Server</a-select-option>
          </a-select>
        </a-space>
      </a-row>
      <a-divider style="margin-top: 12px;margin-bottom: 12px;"/>
      <a-row>
        <a-form>

        </a-form>
      </a-row>

    </div>
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
  :deep(.ant-card-body) {
    padding: 12px;
  }
}
</style>
