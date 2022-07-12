<template>
  <div>
    <el-form ref="from" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" value="">
          <el-option label="" value="value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" placeholder="SPU描述" rows="4"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card"
          :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select placeholder="还差三个" value="">
          <el-option label="" value="value"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        <el-table style="width: 100%;" border>
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column label="属性名"></el-table-column>
          <el-table-column label="属性值操作列表"></el-table-column>
          <el-table-column label="操作"></el-table-column>
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
      spu: {},
      // 保存品牌信息
      trademarkList:[],
      // 保存spu图片信息
      ImageList:[],
      // 保存平台全部销售属性
      BaseSaleAttrList:[]
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
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
        this.ImageList = imageResult.data
      }
      // 获取平台全部销售属性
      const baseSaleAttrResult = await this.$API.spu.reqBaseSaleAttrList()
      // console.log(baseSaleAttrResult);
      if (baseSaleAttrResult.code === 200) {
        this.BaseSaleAttrList = baseSaleAttrResult.data
      }
    }
  }
}
</script>
