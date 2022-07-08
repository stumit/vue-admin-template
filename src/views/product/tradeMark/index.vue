<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <!-- 表格 -->
    <!-- prop:表示对应列内容的字段名 -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称"></el-table-column>
      <el-table-column prop="prop" label="品牌LOGO">
        <!--
            slot-scope插槽，将获取到的图片通过插槽显示出来，
            slot-scope中可以获取两个参数row和$index,
            row:获取到的数据，$index：就是下标
         -->
        <template slot-scope="{row}">
          <img :src="row.logoUrl" alt="图片" style="width: 90px; height: 90px;">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作">
        <el-button type="warning" icon="el-icon-edit" size="mini">修改</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
      </el-table-column>
    </el-table>
    <!--
      分页器
      current-page:当前是第几页
      total：数据的总个数
      page-size：每一页展示数据的个数
      page-sizes：设置每一页展示的个数
      current-change：currentPage 改变时会触发
      size-change：page-size 改变时会触发
    -->
    <el-pagination 
      style="margin-top:20px; 
      text-align:center" 
      :total="total" 
      :current-page="page" 
      :page-size="limit" 
      :page-sizes="[3, 5, 10]" 
      @current-change="getPageList"
      @size-change="handelSizeChange" 
      layout="pager,next,jumper,->,sizes,total"
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  name: 'ReadeMark',
  data() {
    return {
      // 代表当前是第几页
      page: 1,
      // 每一页展示数据的个数
      limit: 5,
      // 总数据的个数
      total: 0,
      // 列表展示的数据
      list: []
    }
  },
  // 组件挂载完毕，发送请求
  mounted() {
    this.getPageList()
  },
  methods: {
    // 获取品牌列表
    async getPageList(pager = 1) {
      // pager就是点击时的页码
      this.page = pager
      // 使用获取品牌列表的接口
      const result = await this.$API.tradeMark.reqTradeMark(this.page, this.limit)
      // console.log(result)
      if (result.code === 200) {
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    handelSizeChange(pagesize){
      this.limit = pagesize
      this.getPageList()
    }
  }
}
</script>
