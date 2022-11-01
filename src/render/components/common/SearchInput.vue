<template>
  <a-space id="search-input-space" style="gap: 0px">
    <!--搜索-->
    <a-button class="tool-btn" id="search-btn" type="text" size="large" @click="showSearchInput">
      <search-outlined class="icon"/>
    </a-button>
    <!--搜索框动画-->
    <transition name="search">
      <div
          v-if="searchInputVisible"
          style="width: 160px;border-bottom:1px solid #cbcbcb;">
        <a-input
            v-model:value="inputValue"
            id="search-input"
            :bordered="false"
            allow-clear
            :onblur="searchInputBlur"
            @change="onSearch"
            placeholder="回车搜索"
        />
      </div>
    </transition>
  </a-space>
</template>

<script setup lang="ts">
import {nextTick, onMounted, ref} from "vue";
import {
  SearchOutlined,
} from '@ant-design/icons-vue'

const emit = defineEmits(['onSearch'])

//搜索框显示
const searchInputVisible = ref<boolean>(false)
//搜索框是否失去焦点
let blur = true
//输入框值
const inputValue = ref()

//查询
const onSearch = () => {
  emit('onSearch', inputValue.value)
}

// blur:搜索框失去焦点时触发
const searchInputBlur = () => {
  blur = true
}

const showSearchInput = () => {
  if (!searchInputVisible.value) {
    searchInputVisible.value = true
    blur = false
    nextTick(() => {
      document.getElementById("search-input").focus()
    })
  } else {
    blur = true
  }
}

onMounted(async () => {
  setInterval(() => {
    if (blur && searchInputVisible.value)
      searchInputVisible.value = false
  }, 600)
})

</script>

<style scoped lang="less">

#search-input-space:deep(.ant-space-item) :hover {
  background-color: rgba(26, 26, 26, 0);
}


@keyframes searchWidth {
  from {
    width: 0;
  }
  to {
    width: 160px;
  }
}

.search-enter-active {
  animation: searchWidth 0.5s;
}

.search-leave-active {
  animation: searchWidth 0.5s reverse;
}
</style>
