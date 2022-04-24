<template>
  <div>
    <!-- CategorySelector -->
    <!-- 根据isShowList选择是否禁用三级联动 -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm" :disabled="!isShowList">
      <el-form-item label="一级分类">
        <el-select v-model="cForm.category1Id" placeholder="请选择" @change="handleCategory1">
          <el-option :label="c1.name" :value="c1.id" v-for="c1 in category1List" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cForm.category2Id" placeholder="请选择" @change="handleCategory2">
          <el-option :label="c2.name" :value="c2.id" v-for="c2 in category2List" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cForm.category3Id" placeholder="请选择" @change="handleCategory3">
          <el-option :label="c3.name" :value="c3.id" v-for="c3 in category3List" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default{
  name:'CategorySelector',
  props:['isShowList'],// 根据isShowList选择是否禁用三级联动
  data(){
    return {
      cForm:{category1Id:'',category2Id:'',category3Id:''},
      category1List:[],
      category2List:[],
      category3List:[],
    }
  },
  mounted(){
    this.getCategory1List();
  },
  methods:{
    async getCategory1List(){
      const result=await this.$API.category.getCategory1();
      if(result.code===200){
        this.category1List=result.data;
      }
    },
    onSubmit(){},
    // 选中了一级分类的回调
    async handleCategory1(category1Id){
      // 用户选中一级分类需要清空二三级分类
      this.category2List=[];
      this.category3List=[];
      this.cForm.category2Id='';
      this.cForm.category3Id='';
      // 触发自定义事件传递一级id
      this.$emit('handlerCategory',{categoryId:category1Id,level:1});
      const result=await this.$API.category.getCategory2(category1Id);
      if(result.code===200){
        this.category2List=result.data;
      }
    },
    // 选中了二级分类的回调
    async handleCategory2(category2Id){
      // 用户选中二级分类需要清空三级分类
      this.cForm.category3Id='';
      this.category3List=[];
      // 触发自定义事件传递二级id
      this.$emit('handlerCategory',{categoryId:category2Id,level:2});
      const result=await this.$API.category.getCategory3(category2Id);
      if(result.code===200){
        this.category3List=result.data;
      }
    },
    // 选中了三级分类的回调
    async handleCategory3(category3Id){
      // 触发自定义事件传递三级id
      this.$emit('handlerCategory',{categoryId:category3Id,level:3});
    }
  }
}
</script>