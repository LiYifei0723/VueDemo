<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!--表格-->
      <tree-table class="treeTable"
                  :data="categoryList"
                  :columns="columns"
                  :selection-type="false"
                  :expand-type="false"
                  show-index
                  index-text="#"
                  border
                  :show-row-hover="false">
        <!--是否有效-->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" style="color: lightgreen" v-show="!scope.row.cat_delete"></i>
          <i class="el-icon-error" style="color: red" v-show="scope.row.cat_delete"></i>
        </template>
        <!--排序级别-->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-if="scope.row.cat_level===2">三级</el-tag>
        </template>
        <!--操作-->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!--分页-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>


    <!--添加分类的对话框-->
    <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%"
            @close="addCateDialogClosed">
      <el-form :model="addCateForm"
               :rules="addCateFormRules"
               ref="addCateFormRef"
               label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：" prop="cat_name">
          <el-cascader
                  v-model="selectKeys"
                  :options="parentList"
                  :props="cascaderProps"
                  @change="parentCateChanged"
                  clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Categories",
    data() {
      return {
        //商品分类的数据列表，默认为空
        categoryList: [],
        //查询条件
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        //总数据条数
        total: 0,
        //为table指定列的定义
        columns: [
          {
            label: '分类名称',
            prop: 'cat_name'
          },
          {
            label: '是否有效',
            type: 'template',
            //表示当前这一列使用的模板名称
            template: 'isok'
          },
          {
            label: '排序',
            type: 'template',
            //表示当前这一列使用的模板名称
            template: 'order'
          },
          {
            label: '操作',
            type: 'template',
            //表示当前这一列使用的模板名称
            template: 'opt'
          }
        ],
        //显示添加分类的对话框
        addCateDialogVisible: false,
        //表单分类
        addCateForm: {
          cat_name: '',
          cat_pid: 0,
          cat_level: 0
        },
        //表单分类规则
        addCateFormRules: {
          cat_name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'},
          ]
        },
        //父级分类
        parentList: [],
        //级联选择器配置对象
        cascaderProps: {
          expandTrigger: "hover",
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
          checkStrictly: true
        },
        //选择的父级分类的id
        selectKeys: []

      }
    },
    created() {
      this.getCategoryList()
    },
    methods: {
      //获取商品分类数据
      async getCategoryList() {
        const {data: res} = await this.$http.get('categories', {params: this.queryInfo})
        if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
        this.categoryList = res.data.result
        this.total = res.data.total
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getCategoryList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getCategoryList()
      },
      //添加分类
      showCateDialog() {
        this.getParentCateList()
        this.addCateDialogVisible = true
      },
      //获取父级分类
      async getParentCateList() {
        const {data: res} = await this.$http.get('categories', {params: {type: 2}})
        this.parentList = res.data
      },
      //修改父级分类
      parentCateChanged() {
        //判断是否选中父级分类
        if (this.selectKeys.length > 0) {
          this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
          this.addCateForm.cat_level = this.selectKeys.length
        } else {
          this.addCateForm.cat_pid = 0
          this.addCateForm.cat_level = 0
        }
      },
      addCate() {
        this.$refs.addCateFormRef.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.post('categories', this.addCateForm)
          console.log(this.addCateForm);
          console.log(this.addCateForm.cat_name);
          if (res.meta.status !== 201) return this.$message.error('添加分类失败！')
          this.$message.success('添加分类成功')
          this.getCategoryList()
          this.addCateDialogVisible = false
        })
      },
      //监听对话框的关闭事件
      addCateDialogClosed() {
        this.$refs.addCateFormRef.resetFields()
        this.selectKeys = []
        this.addCate.cat_level = 0
        this.addCate.cat_pid = 0
      }
    }
  }
</script>

<style lang="less" scoped>
  .treeTable {
    margin-top: 15px;
  }

  .el-cascader {
    width: 100%;
  }
</style>
