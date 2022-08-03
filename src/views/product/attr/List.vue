<template>
  <div>
    <el-card>
      <!-- 三级联动 -->
      <CategorySelector @handlerCategory="handlerCategory" :isShowList="isShowList"></CategorySelector>
    </el-card>
    <el-card style="margin-top:20px">

      <!-- 属性列表页 -->
      <div v-show="isShowList">
        <el-button type="primary" icon="el-icon-plus" @click="showAddDiv" :disabled="!category3Id">添加属性</el-button>
        <el-table border style="width:100%" :data="attrList">
          <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
          <el-table-column prop="prop" label="属性值列表">
            <!-- 展示属性值列表时，需要v-for遍历，而且每个属性值外部都有结构，所以使用作用域插槽 -->
            <template v-slot="{row}">
              <!-- row代表的是当前遍历的属性 -->
              <el-tag type="success" v-for="attrValue in row.attrValueList" :key="attrValue.id">{{attrValue.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template v-slot="{row}">
              <HintButton type="warning" icon="el-icon-edit" title="修改" size="mini" @click="showUpdateDiv(row)"></HintButton>
              <el-popconfirm :title="`你确定要删除${row.attrName}吗？`" @onConfirm="deleteAttr(row)">
                <HintButton slot="reference" type="delete" icon="el-icon-delete" title="删除" size="mini"></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 添加或者修改的页面 -->
      <div v-show="!isShowList">
        <el-form :inline="true" :model="attrForm">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrForm.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrForm.attrName">添加属性值</el-button>
        <el-button @click="isShowList=true">取消</el-button>
        <!-- 展示收集的属性值的列表 -->
        <!-- 收集属性值列表，一开始属性值列表当中没有数据，表格中不显示任何东西，
        当要收集属性值，使用一种占位思想，先往数组中添加一个空对象，只不过属性值的名称此时是空的，
        一旦添加了属性值对象，表格中就新增一行，可以使用输入框收集属性值名称 -->
        <el-table border style="width:100%;margin:20px 0" :data="attrForm.attrValueList">
          <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template v-slot="{row,$index}">
              <el-input v-if="row.isEdit" v-model="row.valueName" placeholder="请输入属性值名称"
              @blur="toLook(row)" @keyup.enter.native="toLook(row)" size="mini" 
              :ref="$index"></el-input>
              <span v-else @click="toEdit(row,$index)" style="display:block;width:100%;height:100%">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template v-slot="{row,$index}">
              <!-- onConfirm事件：点击气泡确认框 -->
              <el-popconfirm :title="`你确定要删除${row.valueName}这个属性值吗？`" 
                @onConfirm="attrForm.attrValueList.splice($index,1)">
                <HintButton slot="reference" type="danger" icon="el-icon-delete" title="删除" size="mini"></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="save" :disabled="attrForm.attrValueList.length===0||attrForm.attrName.trim()===''">保存</el-button>
        <el-button @click="isShowList=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入lodash中的深拷贝
import cloneDeep from 'lodash/cloneDeep';

export default {
  name:'Attr',
  data(){
    return {
      category1Id:'',
      category2Id:'',
      category3Id:'',
      attrList:[],
      isShowList:true,
      // 添加属性要收集的数据
      // data中不能使用this获取data中另外一个数据，因为data是一个对象，初始化时顺序不确定
      attrForm:{
        attrName:'',// 属性名称
        attrValueList:[
          // {attrId:0,id:0,valueName:"string"},
        ],
        categoryId:0,
        categoryLevel:3,
      }
    }
  },
  methods:{
    handlerCategory({categoryId,level}){
      if(level===1){
        this.category1Id=categoryId;
        // 子组件重新选择一级，清空父组件当中二三级和属性列表
        this.category2Id='';
        this.category3Id='';
        this.attrList=[];
      }else if(level===2){
        this.category2Id=categoryId;
        // 子组件重新选择二级，清空父组件当中的三级和属性列表
        this.category3Id='';
        this.attrList=[];
      }else if(level===3){
        this.category3Id=categoryId;
        // 发送请求获取平台属性的列表数据
        this.getAttrList();
      }
    },
    // 请求获取属性的列表数据
    async getAttrList(){
      let {category1Id,category2Id,category3Id}=this;
      const result=await this.$API.attr.getList(category1Id,category2Id,category3Id);
      if(result.code===200){
        this.attrList=result.data;
      }
    },
    // 点击添加按钮显示添加的页面
    showAddDiv(){
      this.isShowList=false;
      // 每次打开添加属性页面重置收集的数据
      this.attrForm={
        attrName:'',
        attrValueList:[],
        categoryId:this.category3Id,
        categoryLevel:3,
      }
    },
    // 收集属性值
    addAttrValue(){
      this.attrForm.attrValueList.push({
        attrId:this.attrForm.id,// 属性值属性的id，有则修改，无则增加
        valueName:"",// 需要用户输入的属性值名称
        isEdit:true,// 标识属性值的模式是编辑模式
      });
      // Vue中dom是异步更新的
      this.$nextTick(()=>{
        this.$refs[this.attrForm.attrValueList.length-1].focus();
      });
    },
    // 点击修改属性按钮显示修改属性的页面
    showUpdateDiv(row){
      this.isShowList=false;
      // this.attrForm={...row};因为内部数组是一个引用类型，浅拷贝仍然是引用地址
      this.attrForm=cloneDeep(row);
      // 已存在的属性值也需添加模式
      // this.$set或Vue.set为响应式对象添加新属性才是响应式属性
      this.attrForm.attrValueList.forEach(item=>{this.$set(item,'isEdit',false)});
    },
    // input失去焦点或者回车，切换为查看模式
    toLook(row){
      // 1.失去焦点时需要判定数据中是否有属性值
      if(row.valueName.trim()===''){
        row.valueName='';
        return;
      }
      // 2.判断当前输入的属性值名称是否已存在
      let isRepeat=this.attrForm.attrValueList.some(item=>{
        if(item!==row){return item.valueName===row.valueName;}
      });
      if(isRepeat){
        this.$message.info('输入的属性值名称不能重复！');
        row.valueName='';
        return
      }
      row.isEdit=false;
    },
    // 点击span，切换为编辑模式
    toEdit(row,index){
      row.isEdit=true;
      // 从span变为input需要自动获取焦点
      // Vue中dom是异步更新的
      this.$nextTick(()=>{
        this.$refs[index].focus();
      });
    },
    // 保存操作
    async save(){
      // 1.获取参数
      let attr=this.attrForm;
      // 2.整理参数
      // (1)属性值名称为空串，从属性值列表当中去除
      // (2)属性值当中去除isEdit属性，只用来作为区分查看和编辑模式的标识
      attr.attrValueList=attr.attrValueList.filter(item=>{
        if(item.valueName!==''){
          delete item.isEdit;
          return true;
        }
      });
      // (3)属性值列表如果没有属性值，不发请求
      if(attr.attrValueList.length===0){
        this.$message.info('属性值列表必须有属性值才能保存！');
        return;
      };
      // 3.发送请求
      try{
        await this.$API.attr.addOrUpdate(attr);
        this.$message.success('保存属性值成功！');
        this.isShowList=true;
        this.getAttrList();
      }catch(error){
        this.$message.error('保存属性值失败！');
      }
    },
    // 删除属性
    async deleteAttr(row){
      try{
        await this.$API.attr.delete(row.id);
        this.$message.success('删除属性成功！');
        this.getAttrList();
      }catch(error){
        this.$message.error('删除属性失败！'+error.message);
      }
    }
  },
  
}
</script>

<style less="scss" scoped>

</style>