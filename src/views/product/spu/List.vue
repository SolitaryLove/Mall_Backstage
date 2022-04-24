<template>
  <div>
    <el-card>
      <!-- 三级联动 -->
      <CategorySelector @handlerCategory="handlerCategory" :isShowList="isShowList"></CategorySelector>
    </el-card>

    <el-card style="margin-top:20px">
      <!-- SPU的列表页 -->
      <div v-show="!isShowSpuForm&&!isShowSkuForm">
          <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="showAddSpuForm">添加SPU</el-button>
          <el-table style="width:100%" border :data="spuList">
            <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
            <el-table-column prop="spuName" label="SPU名称" width="width"></el-table-column>
            <el-table-column prop="description" label="SPU描述" width="width"></el-table-column>
            <el-table-column prop="prop" label="操作" width="width">
              <template v-slot="{row}">
                <HintButton type="success" icon="el-icon-plus" size="mini" title="添加SKU" @click="showAddSkuForm(row)"></HintButton>
                <HintButton type="warning" icon="el-icon-edit" size="mini" title="修改SPU" @click="showUpdateSpuForm(row)"></HintButton>
                <HintButton type="info" icon="el-icon-info" size="mini" title="查看SPU的SKU列表"></HintButton>
                <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除SPU"></HintButton>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="text-align:center"
            :current-page="page"
            :page-sizes="[2,4,6]"
            :page-size="limit"
            :pager-count="5"
            :total="total"
            @current-change="getSpuList"
            @size-change="handleSizeChange"
            layout="prev,pager,next,jumper,->,sizes,total">
          </el-pagination>
      </div>
      <!-- SPU的添加和修改页面 -->
      <!-- <SpuForm v-show="isShowSpuForm" :visible="isShowSpuForm" @update:visible="isShowSpuForm=$event"/> -->
      <SpuForm v-show="isShowSpuForm" :visible.sync="isShowSpuForm" ref="spu"/>
      <!-- SKU的添加页面 -->
      <SkuForm v-show="isShowSkuForm"/>
    </el-card>
  </div>
</template>

<script>
import SpuForm from '@/views/product/components/SpuForm.vue';
import SkuForm from '@/views/product/components/SkuForm.vue';
export default {
  name:'Spu',
  data(){
    return {
      category1Id:'',
      category2Id:'',
      category3Id:'',
      spuList:[],
      isShowList:true,// 控制三级联动是否禁用
      // scene:0,// 0代表展示SPU列表数据 1添加SPU|修改SPU 2添加SKU
      // 分页列表所需数据
      page:1,
      limit:2,
      total:0,
      // 控制页面的显示隐藏
      isShowSpuForm:false,
      isShowSkuForm:false,
    }
  },
  components:{SpuForm,SkuForm},
  methods:{
    handlerCategory({categoryId,level}){
      if(level===1){
        this.category1Id=categoryId;
        this.category2Id='';
        this.category3Id='';
        this.spuList=[];
      }else if(level===2){
        this.category2Id=categoryId;
      }else{
        this.category3Id=categoryId;
        this.getSpuList();
      }
    },
    // 获取spu分页列表
    async getSpuList(pager=1){
      this.page=pager;
      let {page,limit,category3Id}=this;
      const result=await this.$API.spu.getList(page,limit,category3Id);
      if(result.code===200){
        this.spuList=result.data.records;
        this.total=result.data.total;
      }
    },
    // 切换分页列表单面显示条数
    handleSizeChange(size){
      this.limit=size;
      this.getSpuList();
    },
    // 点击添加SPU的回调，显示SPU的添加页面
    showAddSpuForm(){
      this.isShowSpuForm=true;
      // 获取到子组件对象，调用子组件里的方法
      this.$refs.spu.getAddSpuFormInitData();
    },
    // 点击修改SPU的回调，显示SPU的修改页面(添加和修改是一个页面)
    showUpdateSpuForm(row){
      this.isShowSpuForm=true;
      this.$refs.spu.getUpdateSpuFormInitData(row);
    },
    // 点击添加SKU的回调
    showAddSkuForm(row){
      this.isShowSkuForm=true;
    }
  }
}
</script>

<style less="scss" scope>

</style>