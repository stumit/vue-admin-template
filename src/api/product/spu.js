import request from '@/utils/request'

/*
  获取spu列表数据接口
  接口:/admin/product/{page}/{limit}
  请求方式:get
*/
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } })

/*
  获取点击添加或修改后的spu信息
  接口;/admin/product/getSpuById/{spuId}
  请求方式:get
*/
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

/*
  获取点击添加或修改后的品牌信息
  接口:/admin/product/baseTrademark/getTrademarkList
  请求方式:get
*/
export const reqTrademarkList = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: 'get' })

/*
  获取点击添加或修改后的spu图片信息
  接口:/admin/product/spuImageList/{spuId}
  请求方式:get
*/
export const reqImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

/*
  获取点击添加或修改后的平台全部销售属性
  接口:/admin/product/baseSaleAttrList
  请求方式:get
*/
export const reqBaseSaleAttrList = () => request({ url: `/admin/product/baseSaleAttrList`, method: 'get' })