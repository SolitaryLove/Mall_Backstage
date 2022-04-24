// 和品牌相关的接口请求函数
import request from '@/utils/request';


/* 
获取一级分类列表
GET /admin/product/getCategory1
GET /admin/product/getCategory2/{category1Id}、
根据二级分类id获取三级分类列表
GET /admin/product/getCategory3/{category2Id} 
*/

export default {
    // 获取一级分类列表
    getCategory1(){
        return request.get('/admin/product/getCategory1');
    },
    // 根据一级分类id获取二级分类列表
    getCategory2(category1Id){
        return request.get(`/admin/product/getCategory2/${category1Id}`);
    },
    // 根据二级分类id获取三级分类列表
    getCategory3(category2Id){
        return request.get(`/admin/product/getCategory3/${category2Id}`);
    }
}