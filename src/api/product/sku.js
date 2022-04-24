import request from '@/utils/request';

export default {
    // 获取指定SPU的id对应的图片列表
    getSpuImageList(spuId){
        return request.get(`/admin/product/spuImageList/${spuId}`);
    },
}