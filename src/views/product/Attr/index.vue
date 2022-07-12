<template>
  <div>
    <el-card style="margin: 20px 0px;">
      <CategorySelect @getCategoryId='getCategoryId' :show="!isShowTable" />
    </el-card>
    <el-card>
      <!-- 默认展示列表 -->
      <div v-show="isShowTable">
        <!-- 添加属性按钮 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!cFrom.category3Id" @click="addAttr">添加属性</el-button>
        <!-- 表格 -->
        <!-- prop:表示对应列内容的字段名 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150px"></el-table-column>
          <el-table-column prop="prop" label="属性值列表">
            <template slot-scope="{row}">
              <el-tag type="success" style="margin-left: 10px;" v-for="(list) in row.attrValueList" :key="list.id">
                {{ list.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="200px">
            <template slot-scope="{row}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)">修改</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttr(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 点击添加或修改时展示的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性
        </el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table style="width: 100%; margin: 20px 0px;" border :data="attrInfo.attrValueList">
          <el-table-column label="序号" align="center" type="index" width="80"></el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="{row,$index}">
              <el-input v-model="row.valueName" size="mini" placeholder="请输入属性名称" v-if="row.flag" @blur="toLook(row)"
                @keyup.native.enter="toLook(row)" :ref="$index"></el-input>
              <span v-else @click="toEdit(row, $index)" style="display: block ;">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row,$index}">
              <el-popconfirm confirm-button-text='确定' @onConfirm="deleteAttrValue($index)" cancel-button-text='取消'
                icon="el-icon-info" icon-color="red" :title="`确定要删除${row.valueName}吗?`">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addAndUpdateAttr" :disabled="attrInfo.attrValueList.length < 1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
// 按需引入lodash
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      // 用来保存一二三级分类的id
      cFrom: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      },
      // 用来保存平台属性字段
      attrList: [],
      // 用于控制是否展示列表
      isShowTable: true,
      // 收集新增的属性或修改的属性
      attrInfo: {
        // 属性名
        attrName: "",
        // 属性值
        attrValueList: [],
        // 三级分类的id
        categoryId: 0,
        categoryLevel: 0,
      }
    }
  },
  methods: {
    // 获取子组件传递过来的各个分类的id
    getCategoryId(categoryId) {
      this.cFrom = categoryId
      if (this.cFrom.category3Id) {
        this.getAttrList()
      }
    },
    // 获取平台属性的数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this.cFrom
      const result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
      if (result.code === 200) {
        this.attrList = result.data
      }
    },
    // 点击添加按钮
    addAttr() {
      // 设置table的显示和隐藏
      this.isShowTable = false
      // 重置attrInfo中属性名和属性值的数据,并收集三级分类的id
      this.attrInfo = {
        // 属性名
        attrName: "",
        // 属性值
        attrValueList: [],
        // 三级分类的id
        categoryId: this.cFrom.category3Id,
        // 告诉服务器这是几级分类
        categoryLevel: 3,
      }
    },
    // 点击修改按钮
    updateAttr(row) {
      // 设置table的显示和隐藏
      this.isShowTable = false
      // 使用lodash中的深度拷贝
      this.attrInfo = cloneDeep(row)
      this.attrInfo.attrValueList.forEach(item => {
        this.$set(item, 'flag', false)
      });
    },
    // 点击删除按钮
    deleteAttr() {

    },
    // 点击添加属性值按钮
    addAttrValue() {
      // 向attrInfo.attrValueList数组中添加数据
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        flag: true
      })
      this.$nextTick(() => {
        // 为最后一个input框设置聚焦
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // 在input框中失去焦点或点击回车后
    toLook(row) {
      // 判断是否为空
      if (row.valueName.trim() === '') {
        this.$message({
          message: '请输入正常的属性值',
          type: 'warning'
        })
        return
      }
      // 使用数组some方法来判断添加的属性值是否重复
      const isRepeat = this.attrInfo.attrValueList.some(item => {
        // row:当前元素上的属性值,item数组中所有的属性值  
        //  这个if判断将自己去除,为了不让自己跟自己判断,不然永远为true
        if (row !== item) {
          // 判断添加的属性值是否重复
          return row.valueName == item.valueName
        }
      })
      // 判断是否重复
      if (isRepeat) {
        this.$message({
          message: '不能有重复的属性值',
          type: 'warning'
        })
        return
      }
      row.flag = false
    },
    // 点击span的回调
    toEdit(row, index) {
      row.flag = true
      this.$nextTick(() => {
        // 为点击的input框设置聚焦
        this.$refs[index].focus()
      })
    },
    // 添加或修改中删除气泡框中确定按钮的回调
    deleteAttrValue(index) {
      // alert(111)
      // 通过送splice方法删除当前的数据
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 点击保存按钮的回调
    async addAndUpdateAttr() {
      // 通过filter过滤数组中数据为空和flag属性
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        // 过滤空的数据
        if (item.valueName != '') {
          // 删除不必要的属性
          delete item.flag
          return true
        }
      })
      try {
        // 发送请求
        const result = await this.$API.attr.reqSaveAttrInfo(this.attrInfo)
        // 用于控制是否展示列表
        this.isShowTable = true
        // 提示信息
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        // 重新获取平台属性的数据
        this.getAttrList()
      } catch (error) {
        this.$message({
          message: '保存失败',
          type: 'error'
        })
      }
    }
  }
}
</script >
