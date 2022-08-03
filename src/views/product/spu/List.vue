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
                <HintButton type="info" icon="el-icon-info" size="mini" title="查看SPU的SKU列表" @click="showSkuList(row)"></HintButton>
                <el-popconfirm :title="`你确定删除${row.spuName}吗？`" @onConfirm="deleteSpu(row)">
                  <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除SPU" slot="reference"></HintButton>
                </el-popconfirm>
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
      <SpuForm v-show="isShowSpuForm" :visible.sync="isShowSpuForm" ref="spu" @successBack="successBack" @cancelBack="cancelBack"/>
      <!-- SKU的添加页面 -->
      <SkuForm v-show="isShowSkuForm" :visible.sync="isShowSkuForm" ref="sku"/>

      <!-- 点击查看sku列表的对话框 -->
      <el-dialog :title="`${spu.spuName}=>SKU列表`" 
        :visible.sync="dialogVisible" :before-close="resetSkuList">
        <el-table :data="skuList" v-loading="loading">
          <el-table-column property="skuName" label="名称" width="300"></el-table-column>
          <el-table-column property="price" label="价格(元)" width="100"></el-table-column>
          <el-table-column property="weight" label="重量(KG)" width="100"></el-table-column>
          <el-table-column property="name" label="默认图片" width="200">
            <template v-slot="{row}">
              <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
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
      limit:5,
      total:0,
      // 控制页面的显示隐藏
      isShowSpuForm:false,
      isShowSkuForm:false,
      // 控制对话框的显示隐藏
      dialogVisible:false,
      // 给dialog准备的数据
      spu:{},
      skuList:[],
      loading:false,
    }
  },
  // 处理三级联动的可操作性
  watch:{
    isShowSpuForm(newVal,oldVal){
      this.isShowList=!newVal;
    },
    isShowSkuForm(newVal,oldVal){
      this.isShowList=!newVal;
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
      // 将category3Id传递给子组件，方便收集
      this.$refs.spu.getAddSpuFormInitData(this.category3Id);
    },
    // 点击修改SPU的回调，显示SPU的修改页面(添加和修改是一个页面)
    showUpdateSpuForm(row){
      // 用以判断修改或添加操作，存在id则为修改
      this.flag=row.id;
      this.isShowSpuForm=true;
      this.$refs.spu.getUpdateSpuFormInitData(row);
    },
    // 点击添加SKU的回调
    showAddSkuForm(row){
      this.isShowSkuForm=true;
      this.$refs.sku.initAddSkuFormData(row,this.category1Id,this.category2Id);
    },
    // 子组件成功返回后，父组件执行操作
    successBack(){
      // 重新获取数据
      // 判断是修改成功还是添加成功返回的，因为两种请求的页码不一样
      if(this.flag){
        // 修改回来的
        this.getSpuList(this.page);
      }else{
        // 添加回来的
        this.getSpuList();
      }
      this.flag=null;
    },
    // 子组件取消操作后返回
    cancelBack(){
      this.flag=null;
    },
    // 删除属性
    async deleteSpu(row){
      try{
        await this.$API.spu.remove(row.id);
        this.$message.success("删除属性成功！");
        this.getSpuList(this.spuList.length>1?this.page:this.page-1);
      }catch(error){
        this.$message.error("删除属性失败！"+error);
      }
    },
    // 查看spu的sku列表
    async showSkuList(row){
      // 弹出对话框，先把spu保存，用于显示对话框的title
      this.dialogVisible=true;
      this.spu=row;
      // 发送请求获取当前spu的sku列表
      this.loading=true;
      const result=await this.$API.sku.getListBySpuId(row.id);
      if(result.code===200){
        this.skuList=result.data;
      }
      this.loading=false;
    },
    // 关闭对话框
    resetSkuList(){
      //关闭dialog的时候把该重置的数据全部重置
      this.skuList = [];
      this.dialogVisible = false;
      this.loading = false;
    },
  }
}
</script>

<style less="scss" scoped>

</style>