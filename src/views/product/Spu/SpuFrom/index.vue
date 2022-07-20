<template>
  <div>
    {{ unSelectSaleAttr }}
    <el-form ref="from" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option :label="tm.tmName" :value="tm.id" v-for="(tm) in trademarkList" :key="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" placeholder="SPU描述" rows="4" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card" :file-list="ImageList"
          :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleAddSuccess">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}个未选择`" v-model="attrIdAndName">
          <el-option :label="item.name" :value="`${item.id}:${item.name}`" v-for="(item) in unSelectSaleAttr"
            :key="item.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndName" @click="addSaleAttr">添加销售属性</el-button>
        <el-table style="width: 100%;" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column label="属性名" prop="saleAttrName"></el-table-column>
          <el-table-column label="属性值操作列表" prop="prop">
            <template slot-scope="{row}">
              <!-- @close="handleClose(tag)" -->
              <el-tag :key="tag.id" v-for="tag in row.spuSaleAttrValueList" closable :disable-transitions="false">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!--   -->
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput"
                size="small" @blur="handleInputConfirm(row)"></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('changeScene', 0)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'SpuFrom',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // 保存spu信息
      /*
      {
        "category3Id": 0,
        "description": "string",
        "spuName": "string",
        "tmId": 0
        "spuImageList": [
          {
            "id": 0,
            "imgName": "string",
            "imgUrl": "string",
            "spuId": 0
          }
        ],
        "spuSaleAttrList": [
          {
            "baseSaleAttrId": 0,
            "id": 0,
            "saleAttrName": "string",
            "spuId": 0,
            "spuSaleAttrValueList": [
              {
                "baseSaleAttrId": 0,
                "id": 0,
                "isChecked": "string",
                "saleAttrName": "string",
                "saleAttrValueName": "string",
                "spuId": 0
              }
            ]
          }
        ],
      }
      */
      spu: {
        // 三级分类的id
        category3Id: 0,
        // 描述
        description: "",
        // spu名称
        spuName: "",
        // 品牌的id
        tmId: 0,
        // spu图片墙
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0
          // }
        ],
        // spu列表
        spuSaleAttrList: [
          {
            // baseSaleAttrId: 0,
            // id: 0,
            // saleAttrName: "string",
            // spuId: 0,
            // spuSaleAttrValueList: [
            //   {
            //     baseSaleAttrId: 0,
            //     id: 0,
            //     isChecked: "string",
            //     saleAttrName: "string",
            //     saleAttrValueName: "string",
            //     spuId: 0
            //   }
            // ]
          }
        ]
      },
      // 保存品牌信息
      trademarkList: [],
      // 保存spu图片信息
      ImageList: [],
      // 保存平台全部销售属性
      BaseSaleAttrList: [],
      // 收集未选择属性的id和名称
      attrIdAndName: '',
    }
  },
  methods: {
    // 点击图片墙中图片删除按钮的回调 file：为删除的那张图片信息，fileList：返回的是剩下图片信息
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.ImageList = fileList
    },
    // 点击文件列表中的文件时
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 文件上传成功时
    handleAddSuccess(response, file, fileList) {
      this.ImageList = fileList
    },
    async initSpuData(spu) {
      // 获取spu信息
      const spuResult = await this.$API.spu.reqSpu(spu.id)
      if (spuResult.code === 200) {
        this.spu = spuResult.data
      }
      // 获取品牌信息
      const trademarkResult = await this.$API.spu.reqTrademarkList()
      // console.log(trademarkResult);
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data
      }
      // 获取spu图片信息
      const imageResult = await this.$API.spu.reqImageList(spu.id)
      // console.log(imageResult);
      if (imageResult.code === 200) {
        let listArr = imageResult.data
        listArr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        });
        this.ImageList = listArr
      }
      // 获取平台全部销售属性
      const baseSaleAttrResult = await this.$API.spu.reqBaseSaleAttrList()
      // console.log(baseSaleAttrResult);
      if (baseSaleAttrResult.code === 200) {
        this.BaseSaleAttrList = baseSaleAttrResult.data
      }
    },
    // 点击添加销售属性
    addSaleAttr() {
      // 通过split截取保存在attrIdAndName中的字符串
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(":")
      let newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      this.spu.spuSaleAttrList.push(newSaleAttr)
      this.attrIdAndName = ''
    },
    // 点击添加属性值按钮
    showInput(row) {
      // 展示输入框
      this.$set(row, 'inputVisible', true)
      // 收集用户输入的数据
      this.$set(row, 'inputValue', '')
    },
    // 输入框点击回车或失焦时触发的回调
    handleInputConfirm(row) {
      // console.log(row);
      const { baseSaleAttrId, inputValue } = row
      if (inputValue.trim() === '') {
        this.$message({
          message: '警告,不能为空字符串',
          type: 'warning'
        });
        return
      }
     
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      
      let result = row.spuSaleAttrValueList.every(items => items.saleAttrValueName != inputValue)
      console.log(result);
      row.inputVisible = false
    }
  },
  computed: {
    unSelectSaleAttr() {
      return this.BaseSaleAttrList.filter(item => {
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name != item1.saleAttrName
        })
      })
    }
  }
}
</script>

<style>
.el-tag+.el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
