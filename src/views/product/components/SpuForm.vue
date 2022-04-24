<template>
    <div>
        <el-form :model="spuForm">
            <el-form-item label="SPU名称" label-width="100px">
                <el-input placeholder="SPU名称" v-model="spuForm.spuName"></el-input>
            </el-form-item>
            <el-form-item label="品牌" label-width="100px">
                <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
                    <el-option :label="tm.tmName" :value="tm.id" v-for="tm in trademarkList" :key="tm.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="SPU描述" label-width="100px">
                <el-input type="textarea" placeholder="SPU描述" rows="4" v-model="spuForm.description"></el-input>
            </el-form-item>
            <el-form-item label="SPU图片" label-width="100px">
                <!-- :file-list="fileList"的值需要满足一定的格式条件 -->
                <el-upload
                    action="/dev-api/admin/product/fileUpload"
                    list-type="picture-card"
                    :file-list="spuImageList"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-success="handlePictureCardSuccess">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item label="销售属性" label-width="80px">
                <el-select v-model="unUseSaleAttrIdName"
                    :placeholder="unUseSaleAttrList.length>0?`还有${unUseSaleAttrList.length}项未选择`:'已选完'">
                    <el-option :label="unUseSaleAttr.name" :value="`${unUseSaleAttr.id}:${unUseSaleAttr.name}`" 
                        v-for="unUseSaleAttr in unUseSaleAttrList" :key="unUseSaleAttr.id"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-plus" @click="addSaleAttr" :disabled="!unUseSaleAttrIdName">添加销售属性</el-button>
                <el-table border style="width:100%" :data="spuForm.spuSaleAttrList">
                    <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
                    <el-table-column prop="saleAttrName" label="属性名" width="150"></el-table-column>
                    <el-table-column prop="prop" label="属性值名称列表" width="width">
                        <template v-slot="{row}">
                            <!-- disable-transitions移除时会附带渐变动画 -->
                            <el-tag closable
                                v-for="(saleAttrValue,index) in row.spuSaleAttrValueList" :key="saleAttrValue.id" 
                                :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)">
                                {{saleAttrValue.saleAttrValueName}}
                            </el-tag>
                            <el-input
                                class="input-new-tag"
                                v-if="row.inputVisible"
                                v-model="row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(row)"
                                @blur="handleInputConfirm(row)">
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small"  @click="showInput(row)">+ New Tag</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="150">
                        <template v-slot="{$index}">
                            <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除销售属性" 
                            @click="spuForm.spuSaleAttrList.splice($index,1)"></HintButton>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label-width="80px">
                <el-button type="primary">保存</el-button>
                <el-button @click="$emit('update:visible',false)">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name:'SpuForm',
    data(){
        return {
            dialogImageUrl:'',
            dialogVisible:false,
            // 收集所添加的数据
            /* 这个spuForm内部初始化属性都是空的，是为添加spu时收集数据用的
            修改spu时，spuForm就会被赋值为请求返回的有数据的对象 */
            spuForm:{// 请求初始化的spu详情数据
                category3Id:'',
                description:'',
                spuImageList:[],
                spuName:'',
                spuSaleAttrList:[],
                tmId:'',
            },
            spuImageList:[],// 请求初始化的spu图片列表
            trademarkList:[],// 请求初始化的所有品牌列表
            saleAttrList:[],// 请求初始化的所有销售属性列表
            unUseSaleAttrIdName:'',// 收集选中的未使用的销售属性id和name
        }
    },
    prop:['visible'],
    computed:{
        // 根据请求获取的所有销售属性列表和spu详情中已有的销售属性列表计算得到未选择的销售属性
        unUseSaleAttrList(){
            return this.saleAttrList.filter(saleAttr=>
                this.spuForm.spuSaleAttrList.every(spuSaleAttr=>
                    spuSaleAttr.saleAttrName!==saleAttr.name)
            );
        },
    },
    methods:{
        // 和upload相关的回调函数
        // 删除图片成功后的回调
        handleRemove(file, fileList) {
            // console.log(file, fileList);
            this.spuImageList=fileList;
        },
        // 预览大图时的回调
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },   
        // 图片上传成功后的回调
        handlePictureCardSuccess(res,file,fileList){
            this.spuImageList=fileList;
        },
        // 请求获取修改spu的初始化数据
        async getUpdateSpuFormInitData(spu){
            /* 发送4个请求
            1.根据spu的id获取spu的详情
            2.根据spu的id获取spu的图片列表
            3.获取所有的品牌列表
            4.获取所有的销售属性列表 */
            const result=await this.$API.spu.get(spu.id);
            if(result.code===200){
                this.spuForm=result.data;
                // this.$set(this,'spuForm',result.data);
            }
            const imageResult=await this.$API.sku.getSpuImageList(spu.id);
            if(imageResult.code===200){
                let spuImageList=imageResult.data;
                // 让upload可以展示图片列表，将请求回来的图片数据中添加name和url
                spuImageList.forEach(item=>{
                    item.name=item.imgName;
                    item.url=item.imgUrl;
                });
                this.spuImageList=spuImageList;
            }
            const trademarkResult=await this.$API.trademark.getList();
            if(trademarkResult.code===200){
                this.trademarkList=trademarkResult.data;
            }
            const saleAttrResult=await this.$API.spu.getSaleAttrList();
            if(saleAttrResult.code===200){
                this.saleAttrList=saleAttrResult.data;
            }
        },
        // 请求获取添加spu的初始化数据
        async getAddSpuFormInitData(){
            const trademarkResult=await this.$API.trademark.getList();
            if(trademarkResult.code===200){
                this.trademarkList=trademarkResult.data;
            }
            const saleAttrResult=await this.$API.spu.getSaleAttrList();
            if(saleAttrResult.code===200){
                this.saleAttrList=saleAttrResult.data;
            }
        },
        // 点击添加销售属性按钮的回调
        addSaleAttr(){
            // 点击按钮，通过select收集到的数据，获取所收集的销售属性id和name
            let [baseSaleAttrId,saleAttrName]=this.unUseSaleAttrIdName.split(':');
            let obj={
                baseSaleAttrId,
                saleAttrName,
                spuSaleAttrValueList:[],
            };
            this.spuForm.spuSaleAttrList.push(obj);
            this.unUseSaleAttrIdName='';// 收集完毕后清空select值
        },
        // 点击添加销售属性值按钮的回调
        showInput(row){
            /* row.inputVisible=true;
            row.inputVisible是后添加的属性，非响应式
            普通对象赋值方式可能会使v-if和v-show无法刷新 */
            this.$set(row,'inputVisible',true);
            this.$set(row,'inputValue','');
            this.$nextTick(()=>{
                // 当前只存在一个input
                this.$refs.saveTagInput.focus();
            });
        },
        // 当用户输入销售属性值后失去焦点或者回车的回调
        handleInputConfirm(row){
            let saleAttrValueName=row.inputValue;
            let baseSaleAttrId=row.baseSaleAttrId;
            // 判断属性值名称是否是为空串
            console.log(saleAttrValueName)
            if(saleAttrValueName.trim()===''){
                row.inputValue='';
                row.inputVisible=false;
                return;
            }
            // 判断添加的销售属性名称是否已在销售属性值列表中存在
            let isRepeat=row.spuSaleAttrValueList.some(item=>item.saleAttrValueName===saleAttrValueName);
            if(isRepeat){
                this.$message.info('销售属性值名称不能重复！');
                row.inputValue='';
                row.inputVisible=false;
                return;
            }
            let obj={
                baseSaleAttrId,
                saleAttrValueName,
            }
            // 将销售属性值添加到指定的销售属性值列表
            row.spuSaleAttrValueList.push(obj);
            // 隐藏input框
            row.inputVisible=false;
            row.inputValue='';
        },
    }
}
</script>

<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>