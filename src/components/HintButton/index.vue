<template>
  <!-- 
    报错提示信息：
    VM4988:1 Uncaught TypeError: Cannot read properties of null (reading 'match')
        at r (<anonymous>:1:3810)
        at e (<anonymous>:1:3870)
    VM4988:1 Uncaught TypeError: Cannot read properties of null (reading 'match')
        at r (<anonymous>:1:3810)
        at u (<anonymous>:1:3974)
    VM4988:1 Uncaught TypeError: Cannot read properties of null (reading 'match')
        at r (<anonymous>:1:3810)
        at i (<anonymous>:1:4146)
    原因：a标签不添加href属性
    解决：href="javascript:;"
   -->
  <a :title="title" style="margin-right:10px" href="javascript:;">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
  name: "HintButton",
  props: ["title"]
};
</script>

<style scoped>
</style>