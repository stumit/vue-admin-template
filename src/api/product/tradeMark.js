// 这个模块主要获取品牌管理的数据

// 引入二次封装的axios
import request from '@/utils/request'
/**
 * 获取品牌列表
 * 接口：/admin/product/baseTrademark/{page}/{limit}
 * 请求方式：get
 */
export const reqTradeMark = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

/*
  添加品牌
  接口：/admin/product/baseTrademark/save
  请求方式：post
  参数：图片：logoUrl，品牌名称：tmName，不需要id，后台自动添加

  修改品牌
  接口：/admin/product/baseTrademark/update
  请求方式：put
  参数：图片：logoUrl，品牌名称：tmName，id：id
*/
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  // 判断携带的参数是否有id属性
  if (tradeMark.id) {
    // 如果有则为修改
    return request({ url: `/admin/product/baseTrademark/update`, data: tradeMark, method: 'put' })
  } else {
    // 如果没有则为添加
    return request({ url: '/admin/product/baseTrademark/save', data: tradeMark, method: 'post' })
  }
}
/*
  删除品牌
  接口：/admin/product/baseTrademark/remove/{id}
  请求方式：delete
*/
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })
