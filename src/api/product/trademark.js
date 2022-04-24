// 和品牌相关的接口请求函数
import request from '@/utils/request';


export default {
    // 根据品牌id删除指定的品牌
    // /admin/product/baseTrademark/remove/{id}
    delete(id){
        return request.delete(`/admin/product/baseTrademark/remove/${id}`)
    },

    // 无论是增还是改，都需要一个请求体参数，这个参数就是品牌对象
    // 但是这两个请求方式，所传递的品牌对象是不一样的
    // 如果是新增品牌对象里面没有id，如果是修改品牌对象有id
    // 新增一个品牌
    // /admin/product/baseTrademark/save
    // 修改一个品牌
    // /admin/product/baseTrademark/update
    addOrUpdate(trademark){
        if(trademark.id){
            // 如果id存在则表示修改
            return request.put('/admin/product/baseTrademark/update',trademark);
        }else{// 如果id不存在则表示新增
            return request.post('/admin/product/baseTrademark/save',trademark);
        }
    },

    // 查询品牌的分页列表数据
    // /admin/product/baseTrademark/{page}/{limit}
    // page：当前页码 limit：每页记录数
    getPageList(page,limit){
        return request.get(`/admin/product/baseTrademark/${page}/${limit}`);
    },

    // 查询所有的品牌列表数据
    // /admin/product/baseTrademark/getTrademarkList
    getList(){
        return request.get('/admin/product/baseTrademark/getTrademarkList');
    }
}