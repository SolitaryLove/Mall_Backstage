import request from '@/utils/request';

export default {
    /* 获取所有的spu销售属性列表
    GET /admin/product/baseSaleAttrList */
    getSaleAttrList(){
        return request.get('/admin/product/baseSaleAttrList');
    },

    /* 删除指定的spu
    DELETE /admin/product/deleteSpu/{spuId} */
    remove(spuId){
        return request.delete(`/admin/product/deleteSpu/${spuId}`);
    },

    /* 根据id获取SPU详情信息
    GET /admin/product/getSpuById/{spuId}
    spuList：包含多个spu简单信息的数组，数组里面存在了多个spu对象，但每个spu对象的信息不全
    spuInfo：包含一个spu详细信息的对象，信息比较详细 */
    get(spuId){
        return request.get(`/admin/product/getSpuById/${spuId}`);
    },

    /* 添加或更新spu详情信息
    POST /admin/product/saveSpuInfo
    POST /admin/product/updateSpuInfo */
    addUpdate(spuInfo){
        return request({
            url:`POST /admin/product/${spuInfo.id?'update':'save'}SpuInfo`,
            method:'POST',
            data:spuInfo,
        });
    },

    /* 获取spu的分页列表数据
    GET /admin/product/{page}/{limit}
        query参数：category3Id */
    getList(page,limit,category3Id){
        return request({
            url:`/admin/product/${page}/${limit}`,
            method:'GET',
            params:{category3Id},
        });
    },

    // 修改SPU||添加SPU：对于修改或者添加，携带给服务器参数大致一样，唯一的区别是否包含id
    reqAddOrUpdateSpu(spuInfo){
        // 携带的参数包含id——修改SPU
        if(spuInfo.id){
            return request({
                url:'/admin/product/updateSpuInfo',
                method:'POST',
                data:spuInfo,
            });
        }else{// 携带的参数不包含id——保存SPU
            return request({
                url:'/admin/product/saveSpuInfo',
                method:'POST',
                data:spuInfo,
            });
        }
    },

    /* addUpdate(spuInfo){
        return request({
            url:`/admin/product/${spuInfo.id?'update':'save'}SpuInfo`,
            method:'POST',
            data:spuInfo
        })
    } */

    // 获取指定SPU的id对应的图片列表
    getSpuImageList(spuId){
        return request.get(`/admin/product/spuImageList/${spuId}`);
    },

    // 获取指定SPU的id对应的销售属性列表
    getSpuSaleAttrList(spuId){
        return request.get(`/admin/product/spuSaleAttrList/${spuId}`);
    },

    // 添加SKU
    reAddSku(skuInfo){
        return request({
            url:'/admin/product/saveSkuInfo',
            method:'post',
            data:skuInfo,
        })
    }
}