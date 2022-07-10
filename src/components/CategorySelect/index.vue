<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cFrom">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" v-model="cFrom.category1Id" @change="handler1">
          <el-option :label="list.name" :value="list.id" v-for="(list) in list1" :key="list.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择" v-model="cFrom.category2Id" @change="handler2">
          <el-option :label="list.name" :value="list.id" v-for="(list) in list2" :key="list.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="cFrom.category3Id">
          <el-option :label="list.name" :value="list.id" v-for="(list) in list3" :key="list.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "CategorySelect",
  data() {
    return {
      // 用来保存一级分类的数据
      list1: [],
      // 用来保存二级分类的数据
      list2: [],
      // 用来保存三级分类的数据
      list3: [],
      // 用来保存一二三级分类的id
      cFrom: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  methods: {
    // 获取一级分类数据的方法
    async getCategoryList() {
      const result = await this.$API.attr.reqCategory1List()
      if (result.code === 200) {
        this.list1 = result.data
      }
    },
    // 当一级分类option发生变化时获取相应的二级分类
    async handler1() {
      const result = await this.$API.attr.reqCategory2List(this.cFrom.category1Id)
      if (result.code === 200) {
        this.list2 = result.data
      }
    },
    // 当二级分类option发生变化时获取相应的三级分类
    async handler2() {
      const result = await this.$API.attr.reqCategory3List(this.cFrom.category2Id)
        if (result.code === 200) {
          this.list3 = result.data
        }
    }
  },
  mounted() {
    // 使用获取以一级分类的数据的方法
    this.getCategoryList()
  }
}
</script>
