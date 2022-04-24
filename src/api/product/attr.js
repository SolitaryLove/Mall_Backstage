import request from '@/utils/request';

export default{
    /* GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
    DELETE /admin/product/deleteAttr/{attrId}
    POST /admin/product/saveAttrInfo */
    
    // 根据选中的一二级及分类id获取属性列表
    getList(category1Id,category2Id,category3Id){
        return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`);
    },

    // 根据属性id删除某个属性
    delete(attrId){
        return request.delete(`/admin/product/deleteAttr/${attrId}`);
    },

    // 增加或者修改属性
    addOrUpdate(attr){
        return request.post('/admin/product/saveAttrInfo',attr);
    }

}