// 整合接口请求函数

// 先引入再暴露
// 注意：使用引入并暴露时，default引入的时候不能简写
export {default as trademark} from '@/api/product/trademark';
export {default as category} from '@/api/product/category';
export {default as attr} from '@/api/product/attr';
export {default as spu} from '@/api/product/spu';
export {default as sku} from '@/api/product/sku';
/* 暴露出去的对象:
    {
        trademark,
        category
    }
 */