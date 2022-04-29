import request from '@/utils/request';

export default {
    /* 保存SKU
    POST /admin/product/saveSkuInfo
    POST /admin/product/updateSkuInfo*/
    addUpdate (skuInfo) {
        return request.post(`/admin/product/${skuInfo.id ? 'update' : 'save'}SkuInfo`, skuInfo);
    },

    /* 
    根据指定的SPU的id查询所有对应的SKU的列表
    GET /admin/product/findBySpuId/{spuId}
    */
    getListBySpuId(spuId) {
        return request.get(`/admin/product/findBySpuId/${spuId}`);
    },
}