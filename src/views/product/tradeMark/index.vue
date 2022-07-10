<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="addTradeMark">添加</el-button>
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
        <template slot-scope="{row}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>

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
    <el-pagination style="margin-top:20px; 
      text-align:center" :total="total" :current-page="page" :page-size="limit" :page-sizes="[3, 5, 10]"
      @current-change="getPageList" @size-change="handelSizeChange" layout="pager,next,jumper,->,sizes,total">
    </el-pagination>

    <!-- 对话框，用于点击添加和修改按钮时，弹出对话框，修改添加数据 -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <!-- 
        el-form 组件提供了表单验证的功能，
        只需要通过 rules 属性传入约定的验证规则，
        并将 Form-Item 的 prop 属性设置为需校验的字段名即可 
      -->
      <el-form style="width: 80%;" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <!-- 收集品牌名称 -->
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 
            收集品牌的图片 
            action：设置上传图片的路径
            on-success：检测图片是否上传成功，上传成功会执行一次
            before-upload：在图片上传之前，执行一次
          -->
          <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'ReadeMark',
  data() {
    return {
      // 代表当前页
      page: 1,
      // 每一页展示数据的个数
      limit: 5,
      // 总数据的个数
      total: 0,
      // 列表展示的数据
      list: [],
      // 控制对话框的显示与隐藏
      dialogFormVisible: false,
      // 收集品牌的信息
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      // 
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请选择品牌图片' }
        ],
      }
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
    // page-size 改变时的回调函数
    handelSizeChange(pagesize) {
      this.limit = pagesize
      this.getPageList()
    },
    // 点击添加按钮的回调函数
    addTradeMark() {
      this.dialogFormVisible = true
      // 每次点击添加按钮都清空tmForm中的数据
      this.tmForm = { tmName: '', logoUrl: '' }
    },
    // 点击修改按钮的回调函数
    // row:就是当前点击修改的品牌信息
    updateTradeMark(row) {
      this.dialogFormVisible = true;
      // 将row当中的数据直接保存在tmForm中
      this.tmForm = { ...row }
    },
    // 点击删除按钮的回调函数
    // row:就是当前点击修改的品牌信息
    deleteTradeMark(row) {
      this.$confirm(`此操作将永久删除${row.tmName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 点击确定时,发送请求
        const result = await this.$API.tradeMark.reqDeleteTradeMark(row.id)
        if (result.code === 200) {
          // 展示提示信息
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 重新获取数据，但要判断列表展示的数据是否大于1，如果大于1就展示当前页，否则展示前一页
          this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 图片上传成功的回调
    // res:上传成功后返回的数据
    // file：上传成功后返回的数据
    handleAvatarSuccess(res) {
      this.tmForm.logoUrl = res.data
      // console.log(res);
      // console.log(file);

      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    // 图片上传之前的回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 点击对话框中确定按钮的回调，用于添加或修改
    addOrUpdateTradeMark() {
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          // 隐藏对话框
          this.dialogFormVisible = false;
          // 发送请求
          const result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(this.tmForm);
          if (result.code === 200) {
            this.$message({
              message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功',
              type: 'success'
            })
            this.getPageList(this.tmForm.id ? this.page : 1)
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    }

  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
