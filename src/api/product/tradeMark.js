// 这个模块主要获取品牌管理的数据

// 引入二次封装的axios
import request from '@/utils/request'
/**
 * 获取品牌列表
 * 接口：/admin/product/baseTrademark/{page}/{limit}
 * 请求方式：get
 */
export const reqTradeMark = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })
