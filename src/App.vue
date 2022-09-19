<template>
  <img alt="Vue logo" src="./assets/vue.svg"/>
  <Demo/>
</template>

<script>
import Demo from "./components/buttonDemo.vue";
import {defineComponent} from "vue";

export default defineComponent({
  components: {
    Demo,
  },
});
</script>
