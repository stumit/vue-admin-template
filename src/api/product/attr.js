// 平台属性管理的请求接口
import request from '@/utils/request';

/*
  获取一级，二级，三级菜单
  接口：/admin/product/getCategory1 （一级菜单接口）
  接口：/admin/product/getCategory2/{category1Id} （二级菜单接口）
  接口：/admin/product/getCategory3/{category2Id} （三级菜单接口）
  请求方式：get
*/
export const reqCategory1List = () => request({ url: '/admin/product/getCategory1', method: 'get' })

export const reqCategory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' })

export const reqCategory3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' })

/*
  获取平台属性
  接口：/admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  请求方式：get
*/
export const reqAttrList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

/*
  添加或修改平台属性
  接口：/admin/product/saveAttrInfo
  需要携带的参数：
  {
    "attrName": "string",
    "attrValueList": [
      {
        "attrId": 0,
        "valueName": "string"
      }
    ],
    "categoryId": 0,
    "categoryLevel": 0,
  }
  请求方式：post
*/
export const reqSaveAttrInfo = (data) => request({ url: '/admin/product/saveAttrInfo', data, method: 'post' })