<template>
  <div>
    <el-card style="margin: 20px 0px;">
      <!-- 三级联动的全局注册组件 -->
      <CategorySelect @getCategoryId='getCategoryId' :show="!isShowTable" />
    </el-card>
    <el-card>
      <!-- 默认展示列表 -->
      <div v-show="scent === 0">
        <!-- 添加属性按钮 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!cFrom.category3Id" @click="addSpu">添加属性</el-button>
        <!-- 表格 -->
        <!-- prop:表示对应列内容的字段名 -->
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
          <el-table-column prop="spuName" label="spu名称"></el-table-column>
          <el-table-column prop="description" label="spu描述"></el-table-column>
          <el-table-column prop="prop" label="操作">
            <template slot-scope="{row}">
              <el-button type="success" icon="el-icon-plus" size="mini" @click="addSku"></el-button>
              <el-button type="warning" icon="el-icon-edit" size="mini"  @click="updateSpu(row)"></el-button>
              <el-button type="info" icon="el-icon-info" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="text-align: center;" :total="total" :current-page="page" :page-size="limit"
          :page-sizes="[5, 10, 15]" @size-change="sizeChange" @current-change="getSpuList"
          layout="prev, pager, next, jumper, ->, sizes, total"></el-pagination>
      </div>
      <SpuFrom v-show="scent === 1" @changeScene ="changeScene" ref="spu" />
      <SkuFrom v-show="scent === 2" />
    </el-card>
  </div>
</template>
<script>
import SkuFrom from './SkuFrom'
import SpuFrom from './SpuFrom'
export default {
  name: 'Spu',
  components: { SkuFrom, SpuFrom },
  data() {
    return {
      // 用来保存一二三级分类的id
      cFrom: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      },
      // 用于控制三级联动的可操作性
      isShowTable: true,
      // 初始page:当前页码,limit:每一页数据的个数,total:数据的总个数
      page: 1,
      limit: 5,
      total: 0,
      // 获取到的列表数据
      records: [],
      // 设置展示与隐藏的是属性 0为展示默认列表数据,1为点击添加或修改按钮展示spu组件,2为展示添加组件
      scent:0
    }
  },
  methods: {
    getCategoryId(categoryId) {
      this.cFrom = categoryId
      if (this.cFrom.category3Id) {
        this.getSpuList()
      }
    },
    // 获取spu列表数据
    async getSpuList(page = 1) {
      this.page = page
      // 需要携带三个参数page:当前页码,limit:每一页数据的个数,category3Id:三级分类的id
      const result = await this.$API.spu.reqSpuList(this.page, this.limit, this.cFrom.category3Id)
      if (result.code === 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    // 当limit每一页数据的个数发送变化是触发的回调
    sizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },
    // 点击添加属性按钮
    addSpu(){
      this.scent = 1
      this.isShowTable = false 
    },
    // 点击列表中的修改按钮
    updateSpu(row){
      this.scent = 1
      this.isShowTable = false 
      // 通过ref在父组件中获取并执行子组件中的方法
      this.$refs.spu.initSpuData(row)
    },
    // 点击列表中的添加按钮
    addSku(){
      this.scent = 2
      this.isShowTable = false 
    },
    // spuFrom子组件点击取消传来的回调
    changeScene(scene){
      this.scent = scene
    }
  }
}
</script>

