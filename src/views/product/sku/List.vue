<template>
  <el-card class="sku-list">
    <el-table :data="skuList" border stripe v-loading="loading">
      <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
      <el-table-column prop="skuName" label="名称"></el-table-column>
      <el-table-column prop="skuDesc" label="描述"></el-table-column>
      <el-table-column label="默认图片">
        <template v-slot="{row}">
          <div class="info">
            <div class="pic">
              <img :src="row.skuDefaultImg" alt="商品图片" style="width:60px">
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)"></el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80"></el-table-column>
      <el-table-column label="操作" width="250" align>
        <template v-slot="{row}">
          <HintButton v-if="row.isSale == 0" title="上架"
            type="info" size="mini" icon="el-icon-top"
            @click="onSale(row.id)"/>

          <HintButton v-if="row.isSale == 1" title="下架"
            type="success" size="mini" icon="el-icon-bottom"
            @click="cancelSale(row.id)"/>

          <HintButton title="修改" type="primary" size="mini"
            icon="el-icon-edit" @click="toUpdateSku(row.id)"/>

          <HintButton title="查看详情" type="info" size="mini"
            icon="el-icon-info" @click="showSkuInfo(row.id)"/>

          <el-popconfirm :title="`确定删除 ${row.skuName} 吗`"
            @onConfirm="deleteSku(row.id)">
            <HintButton
              style="margin-left: 10px" slot="reference"
              type="danger" size="mini" icon="el-icon-delete"
              title="删除"></HintButton>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5,10,15,20,25,30]"
      style="padding: 20px 0; text-align: center"
      layout="prev,pager,next,jumper,->,sizes,total"
      @current-change="getSkuList"
      @size-change="changeSize">
    </el-pagination>

    <el-drawer :visible.sync="isShowSkuInfo" :with-header="false" size="35%" class="drawer">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="18">
          <el-tag type="success" style="margin-right:5px"
            v-for="value in skuInfo.skuAttrValueList" :key="value.id">
            {{value.attrId+"-"+value.valueId}}
          </el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel class="sku-carousel" trigger="click" height="300px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </el-card>

</template>

<script>
export default {
  name:'Sku',
  data(){
    return {
      skuList:[],// SKU列表
      loading:false,// 是否正在加载中
      total:0,// 数据库中的总记录数
      page:1,// 默认页码
      limit:10,// 每页记录数
      skuInfo:{},
      isShowSkuInfo:false,
    }
  },
  mounted(){
    this.getSkuList();
  },
  methods:{
    // 修改sku，暂无接口
    toUpdateSku(){
      this.$message.info("正在开发中...");
    },
    // 获取指定页码的sku列表
    async getSkuList(page=1){
      this.page=page;
      this.loading=true;
      const result=await this.$API.sku.getList(this.page,this.limit);
      this.skuList=result.data.records;
      this.total=result.data.total;
      this.loading=false;
    },
    // 当页码发生改变自动调用
    changeSize(size) {
      this.limit = size;
      this.getSkuList(1);
    },
    // 对指定SKU进行上架的请求
    async onSale(skuId){
      await this.$API.sku.onSale(skuId);
      this.$message({type:"success",message:"上架成功！"});
      this.getSkuList(this.page);
    },
    // 对指定SKU进行下架的请求
    async cancelSale(skuId){
      await this.$API.sku.cancelSale(skuId);
      this.$message({type:"success",message:"下架成功！"});
      this.getSkuList(this.page);
    },
    // 删除指定的SKU
    async deleteSku(){
      try{
        await this.$API.sku.remove(skuId);
        this.$message({type:"success",message:"删除SKU成功！"});
        this.getSkuList(1);
      }catch(error){
        this.$mesage({type:"error",message:error.message||"删除SKU失败！"});
      }
    },
    // 查看详情
    async showSkuInfo(id){
      this.isShowSkuInfo=true;
      /* let loadingDrawer=this.$loading({
        target:'drawer',
        test:'正在加载中...',
        fullscreen:false,
      }); */
      const result=await this.$API.sku.get(id);
      this.skuInfo=result.data;
/*       this.$nextTick(()=>{
        loadingDrawer.close();
      }); */
    }
  }
}
</script>

<style lang="scss" scoped>
// scoped 我们当前组件的样式就被限制在本组件内部，无法影响其它组件
// 深度作用选择器  
    // scoped本身把样式限制在本组件和子组件的根元素，如果样式是作用在子组件非根元素身上，就不生效
    // 深度作用选择器的作用就是让scoped内部的样式也能作用于子组件非根元素的元素  

/*深度作用选择器的写法    ********************
  如果是原生css 深度作用选择器  
      父元素 >>> 选中的元素 
  如果是less  scss 预编译的css文件
      /deep/ 用于less
      ::v-deep  都行
      */
.sku-list {
  .el-row {
    height: 40px;
    .el-col {
      line-height: 40px;
      &.el-col-5 {
        font-size: 18px;
        font-weight: bold;
        text-align: right;
        margin-right: 20px;
      }
    }
  }

  .sku-carousel {
    width: 300px;
    border: 1px solid #ccc;
    img {
      width: 300px;
      height: 300px;
    }
  }

  ::v-deep .el-carousel__indicator{
    button{
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: hotpink;
    }
    &.is-active{
      button{
        background-color: rgba(255,255,255,.6);
      }
    }
  }
}
</style>