<template>
    <div>
        <el-form :model="skuForm" label-width="100px">
            <el-form-item label="SPU 名称">{{spu.spuName}}</el-form-item>
            <el-form-item label="SKU 名称">
                <el-input v-model="skuForm.skuName" placeholder="SKU 名称"></el-input>
            </el-form-item>
            <el-form-item label="价格(元)">
                <el-input v-model="skuForm.price" placeholder="SKU 价格" type="number"></el-input>
            </el-form-item>
            <el-form-item label="重量(千克)">
                <el-input v-model="skuForm.weight" placeholder="SKU 重量" type="number"></el-input>
            </el-form-item>
            <el-form-item label="规格描述">
                <el-input v-model="skuForm.skuDesc" placeholder="SKU 规格描述" type="textarea" rows="4"></el-input>
            </el-form-item>
            <el-form-item label="平台属性">
                <el-form :model="skuForm" :inline="true" label-width="80px">
                    <el-form-item :label="attr.attrName" v-for="attr in attrList" :key="attr.id">
                        <el-select v-model="attr.attrIdValueId" placeholder="请选择">
                            <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`"
                                v-for="attrValue in attr.attrValueList" :key="attrValue.id">
                            </el-option> 
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="销售属性">
                <el-form value="" :inline="true" label-width="80px">
                    <el-form-item :label="spuSaleAttr.saleAttrName" v-for="spuSaleAttr in spuSaleAttrList" :key="spuSaleAttr.id">
                        <el-select v-model="spuSaleAttr.spuSaleIdValueId" placeholder="请选择">
                            <el-option :label="spuSaleAttrValue.saleAttrValueName" 
                                :value="`${spuSaleAttr.id}:${spuSaleAttrValue.id}`" 
                                v-for="spuSaleAttrValue in spuSaleAttr.spuSaleAttrValueList" :key="spuSaleAttrValue.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="图片列表">
                <el-table :data="spuImageList" style="width:100%" border @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="prop" label="图片" width="width">
                        <template v-slot="{row}">
                            <img :src="row.imgUrl" alt="" style="width:100px" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="imgName" label="名称" width="width"></el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <template v-slot="{row}">
                            <el-button type="primary" size="mini" v-if="row.isDefult==='0'" @click="setDefault(row)">设为默认</el-button>
                            <el-tag type="success" v-else>默认</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
/* 
数据收集分析：
    来源于父组件
        category3Id:"",
        tmId:"",
    通过v-model直接收集
        price:"",
        weight:"",
        skuName:"",
        skuDesc:"",
    通过代码手动收集
        skuDefaultImg:"",
        skuAttrValueList:[
            {attrId:0,valueId:0}
        ],
        skuImageList:[],
        skuSaleAttrValueList:[],
*/
export default {
    name:'SkuForm',
    data(){
        return {
            // 收集数据
            skuForm:{
                tmId:'',
                category3Id:'',

                price:'',
                weight:"",
                skuName:"",
                skuDesc:"",

                skuDefaultImg:"",
                skuAttrValueList:[],
                skuImageList:[],
                skuSaleAttrValueList:[]
            },
            spu:{},
            // 存储初始化数据
            attrList:[],
            spuSaleAttrList:[],
            spuImageList:[],// 展示所有的图片
            checkedImageList:[],// 收集选中的图片
        }
    },
    methods:{
        // 初始化请求获取动态显示的数据
        async initAddSkuFormData(row,category1Id,category2Id){
            // 保存传递的数据，后期展示需要
            this.spu=row;
            // 根据三级分类id获取平台属性的分页列表
            const promise1=this.$API.attr.getList(category1Id,category2Id,row.category3Id);
            // 获取指定SPU的id对应的销售属性列表
            const promise2=this.$API.spu.getSpuSaleAttrList(row.id);
            // 获取指定SPU的id对应的图片列表
            const promise3=this.$API.spu.getSpuImageList(row.id);
            // 处理并发请求
            const result=await Promise.all([promise1,promise2,promise3]);
            this.attrList=result[0].data;
            this.spuSaleAttrList=result[1].data;
            let spuImageList=result[2].data;
            // 为了实现默认图片功能，每个图片信息中添加一个isDefault属性
            spuImageList.forEach(item=>item.isDefult='0');
            this.spuImageList=result[2].data;
        },
        // 收集图片选中或者取消的回调
        handleSelectionChange(val){
            this.checkedImageList=val;
        },
        // 设置成默认
        setDefault(row){
            // 排它设置默认图片
            this.spuImageList.forEach(item=>item.isDefult='0');
            row.isDefult='1';
            // 一量设置完毕，将默认图片的路径收集
            this.skuForm.skuDefaultImg=row.imgUrl;
        },
        // 保存操作
        async save(){
            // 获取参数数据
            let {spu,skuForm,attrList,spuSaleAttrList,checkedImageList}=this;
            // 整理参数
            // (1)整理父组件传递的数据
            skuForm.spuId=spu.id;
            skuForm.category3Id=spu.category3Id;
            skuForm.tmId=spu.tmId;
            // (2)整理图片列表
            /* 
                最终需要的数据：
                {
                    imgName: "string",      
                    imgUrl: "string",
                    isDefault: "string",
                    spuImgId: 0             
                },
                目前的数据结构：
                {
                    id:21
                    imgName:"76c7922bb9d226d0.jpg"
                    imgUrl:"http://47.93.148.192:8080/group1/M00/00/02/rBHu8l-sklaAPVqkAAEoiSa9WoM463.jpg"
                    isDefault:"0"
                    spuId:4
                }
            */
            checkedImageList=checkedImageList.map(item=>{
                return {
                    imgName: item.imgName,
                    imgUrl: item.imgUrl,
                    isDefault: item.isDefault,
                    spuImgId: item.id,
                }
            });
            skuForm.skuImageList=checkedImageList;
            // (3)整理sku的平台属性列表和销售属性列表
            skuForm.skuAttrValueList=attrList.reduce((prev,item)=>{
                // 判断哪个平台属性被选择过属性值
                if (item.attrIdValueId) {
                    // 把收集的数据转化为需要的属性值结构
                    let [attrId,valueId]=item.attrIdValueId.split(":");
                    let obj={attrId,valueId};
                    prev.push(obj);
                }
                return prev;
            },[]);
            skuForm.skuSaleAttrValueList=spuSaleAttrList.reduce((prev,item)=>{
                if(item.spuSaleIdValueId){
                    let [saleAttrId,saleAttrValueId]=item.spuSaleIdValueId.split(":");
                    let obj={saleAttrId,saleAttrValueId};
                    prev.push(obj);
                }
                return prev;
            },[]);
            // console.log(skuForm.skuAttrValueList,skuForm.skuSaleAttrValueList,skuForm.skuImageList);
            // 发送请求
            try{
                console.log(skuForm);
                // await this.$API.sku.addUpdate(skuForm);
                this.$message.success("保存sku成功！");
                // 返回到List，不需要重新获取spu列表数据
                this.$emit('update:visible',false);
                // 清空sku相关data数据
                this.resetData();
            }catch(error){
                this.$message.error("保存sku失败！");
            }
        },
        // 重置数据
        resetData(){
            this.spu = {};
            this.attrList = [];
            this.spuSaleAttrList = [];
            this.spuImageList = [];
            this.checkedImageList = [];
            this.skuForm = {
                spuId: "",
                category3Id: "",
                tmId: "",
                skuName: "",
                price: "",
                weight: "",
                skuDesc: "",
                skuAttrValueList: [],
                skuDefaultImg: "", //默认图片的路径
                skuImageList: [],
                skuSaleAttrValueList: [],
            };
        },
        // 退出
        cancel(){
            this.$emit('update:visible',false);
            this.resetData();
        }
    }
}
</script>