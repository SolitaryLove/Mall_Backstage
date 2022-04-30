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
    GET /admin/product/findBySpuId/{spuId}*/
    getListBySpuId(spuId) {
        return request.get(`/admin/product/findBySpuId/${spuId}`);
    },

    /* 获取SKU的分页列表
    GET /admin/product/list/{page}/{limit}*/
    getList(page,limit) {
        return request.get(`/admin/product/list/${page}/${limit}`);
    },

    /* 下架SKU
    GET /admin/product/cancelSale/{skuId}*/
    cancelSale (skuId) {
        return request.get(`/admin/product/cancelSale/${skuId}`);
    },

    /* 上架SKU GET /admin/product/onSale/{skuId}*/
    onSale (skuId) {
        return request.get(`/admin/product/onSale/${skuId}`);
    },

    /* 删除指定id的sku
    DELETE /admin/product/deleteSku/{skuId}*/
    remove (skuId) {
        return request.delete(`/admin/product/deleteSku/${skuId}`);
    },

    /* 根据SKU的id查询SKU的详细信息
    GET /admin/product/getSkuById/{skuId}*/
    get (skuId) {
        return request.get(`/admin/product/getSkuById/${skuId}`);
    },
}