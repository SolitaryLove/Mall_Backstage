<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog">添加</el-button>
    <!-- el-table :data="data"是用来展示数据的
    表格展示数据的时候，数据的格式必须是一个数组，数组内部是对象
    table会将这个数组传递给每一个列，每个列内部都通过v-for展示该数据
    且结构是由自己决定，el-table-column内部有作用域插槽 -->
    <!-- el-table-column label="label" 列名称 -->
    <el-table
      :data="trademarkList"
      border
      style="width:100%;margin:20px 0">
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="80"></el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"></el-table-column>
      <el-table-column
        label="品牌LOGO"
        width="width">
          <template v-slot="{row}">
            <!-- row:当前遍历的对象，$index:当前遍历对象的下标 -->
            <img :src="row.logoUrl" alt="" style="width:30%">
          </template>
        </el-table-column>
      <el-table-column
        label="操作"
        width="width">
          <template v-slot="{row}">
            <el-button type="warning" icon="el-icon-edit" size="mini" @click="showUpdateDialog(row)">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTrademark(row)">删除</el-button>
          </template>
        </el-table-column>
    </el-table>

    <!-- 分页器：
    :current-page="pageNum"   传递的当前页码
    :page-size="pageSize"     传递的每页数量
    :total="totalCount"       传递的总数
    :pager-count="3"          传递的首页+连续页数+尾页
    :page-sizes="[10,20,50]"  可以改变当前页的数量
    @current-change="handleCurrentChange" 切换页码的事件
    @size-change="handleSizeChange"       改变当前页数的事件
    layout="total,sizes,prev,pager,next,jumper" 分页器布局
    -->
    <el-pagination
      style="text-align:center"
      :current-page="page"
      :page-size="limit"
      :total="total"
      :pager-count="7"
      :page-sizes="[3,5,10]"
      layout="prev,pager,next,jumper,->,sizes,total"
      @current-change="getTrademarkList"
      @size-change="handleSizeChange">
    </el-pagination>

    <!-- 点击添加或修改弹出的对话框页面 -->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <!-- model="Object"作用：对form表单进行验证；标识form所收集的数据 -->
      <el-form style="width:80%" :model="tmForm" :rules="rules" ref="tmForm">
        <!-- label-width设置表单项名称的宽度 -->
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 在拷贝upload组件时，把html，css，js相关的东西全部拷贝 -->
          <!-- action控制的是上传的接口地址 -->
          <!-- 上传图片步骤：
            1.调用接口将本地的图片传到后端服务器；
            2.后端返回这个图片在服务器上的地址，需要收集该路径 -->
          <!-- 
            :on-success="handleAvatarSuccess"图片上传成功后回调
            :before-upload="beforeAvatarUpload"图片上传前的回调
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'Trademark',
  data(){
    return {
      page:1,// 当前页码
      limit:3,// 每页数量
      trademarkList:[],// 品牌列表
      total:0,// 品牌总数
      dialogFormVisible:false,// 是否显示对话框
      // imageUrl:'',// 品牌logo路径
      tmForm:{// 收集新增的品牌信息
        tmName:'',
        logoUrl:'',
      },
      // 表单验证规则
      // 每个要验证的字段规则都是一个数组
      // 数组里面是对象,每一个对象就代表是验证的一个规则(规则 错误提示信息 触发时机)
      // 触发时机：失去焦点blur 内容改变change 整体验证时
      rules:{
        tmName:[
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        logoUrl:[
          { required: true, message: '请上传图片' },// 整体验证
        ]
      },
    }
  },
  mounted(){
    this.getTrademarkList();
  },
  methods:{
    // 获取品牌列表
    async getTrademarkList(page=1){
      this.page=page;
      const result=await this.$API.trademark.getPageList(this.page,this.limit);
      if(result.code===200){
        this.trademarkList=result.data.records;
        this.total=result.data.total;
      }
    },
    // 切换每页显示数量的回调
    handleSizeChange(size){
      this.limit=size;
      this.getTrademarkList();
    },
    // 图片上传成功的回调
    handleAvatarSuccess(res,file){
      // res:上传成功后返回的响应数据 file:上传成功的文件
      // this.imageUrl = URL.createObjectURL(file.raw);本地路径
      this.tmForm.logoUrl=res.data;// file.response.data
    },
    // 图片上传前的回调
    beforeAvatarUpload(file) {
      // 限制图片的格式和大小
      // file代表的是上传的图片
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 点击添加按钮弹出dialog框
    showAddDialog(){
      this.dialogFormVisible=true;
      // 将tmForm中的数据重置
      this.tmForm={
        tmName:'',
        logoUrl:'',
      }
    },
    // 点击修改按钮弹出dialog框
    showUpdateDialog(row){
      this.dialogFormVisible=true;
      // this.tmForm=row;// 需要修改的行数据
      // 解决修改弹出dialog框中数据时改变列表页展示的数据
      // row是列表页中展示的数据，tmForm是dialog框中展示的数据
      // this.tmForm=row;是将列表页的数据地址传递给tmForm，地址引用
      // row中只有基本数据类型，可以使用浅拷贝
      this.tmForm={...row};
    },
    // 点击确定按钮发送请求添加或修改品牌
    addOrUpdateTrademark(){
      // 整体验证
      this.$refs.tmForm.validate(async (valid) => {
        if (valid) {
          // 验证通过
          let trademark=this.tmForm;
          try{
            await this.$API.trademark.addOrUpdate(trademark);
            this.$message.success(trademark.id?'修改品牌成功':'添加品牌成功');
            // 关闭dialog框
            this.dialogFormVisible=false;
            // 如果添加成功，重新请求的是第一页数据，添加新的数据是在最后一页
            // 如果修改成功，重新请求修改数据所在页
            this.getTrademarkList(trademark.id?this.page:1);
          }catch(error){
            console.log(error)
            this.$message.error(trademark.id?'修改品牌失败':'添加品牌失败');
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      
    },
    // 点击删除按钮删除指定的品牌
    deleteTrademark(row) {
      this.$confirm(`你确定要删除${row.tmName}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 删除品牌
        try{
          this.$API.trademark.delete(row.id);
          this.$message.success('删除品牌成功！');
          // 正常删除哪个数据回到其所在的页面
          // 假使所删除的数据那一页只有一条数据，需要回到前一页
          this.getTrademarkList(this.trademarkList.length>1?this.page:this.page-1>0?this.page:1);
        }catch(error){
          console.log(error);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    }
  }
}
</script>

<style less="scss" scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>