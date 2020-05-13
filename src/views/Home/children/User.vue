<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--搜索与添加区域-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear='getUserList'>
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--表格数据-->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username">

        </el-table-column>
        <el-table-column label="邮箱" prop="email">

        </el-table-column>
        <el-table-column label="电话" prop="mobile">

        </el-table-column>
        <el-table-column label="角色" prop="role_name">

        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
                    v-model="scope.row.mg_state"
                    active-color="#409eff"
                    inactive-color="#dcdfe6"
                    @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="deleteUserById(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[1, 2, 4, 10]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>


    <!--修改用户对话框-->
    <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="50%" @click="editDialogClose">
      <el-form ref="editFormRef" label-width="70px" :model="editForm" :rules="editFormRules">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible=false" :plain="true">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>


    <!--添加用户对话框-->
    <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClose">
      <!--内容主题区-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "User",
    data() {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 2
        },
        userList: [],
        total: 0,
        addDialogVisible: false,
        //添加用户表单数据
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        //添加表单验证规则对象
        addFormRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 15, message: '长度在 6 到 15个字符', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱地址', trigger: 'blur'},
            {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur'}
          ]
        },
        //修改用户表单验证规则对象
        editFormRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱地址', trigger: 'blur'},
            {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur'}
          ]
        },
        //修改用户按钮
        editDialogVisible: false,
        //用户信息
        editForm: {}
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      //修改用户
      async showEditDialog(id) {

        const {data: res} = await this.$http.get('users/' + id)

        if (res.meta.status !== 200) return this.$message.error('查询用户信息失败')
        this.editForm = res.data
        this.editDialogVisible = true
      },
      //点击按钮，添加新用户
      addUser() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return this.$message.error('请输入正确信息')
          //发起添加用户的网络请求
          const {data: res} = await this.$http.post('/users', this.addForm)

          if (res.meta.status !== 201) {
            this.$message.error('添加用户失败')
          }

          this.$message.success('添加用户成功')

          //添加成功后隐藏添加用户的对话框
          this.addDialogVisible = false
          //重新获取用户列表数据
          this.getUserList()
        })
      },
      //重置添加表单
      addDialogClose() {
        this.$refs.addFormRef.resetFields()
      },
      //监听switch开关状态的改变
      async userStateChanged(userinfo) {
        const {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户状态失败')
          userinfo.mg_state = !userinfo.mg_state
        }
        this.$message.success('更新用户成功')
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getUserList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getUserList()
      },
      async getUserList() {
        const {data: res} = await this.$http.get('users', {params: this.queryInfo})
        if (res.meta.status !== 200) return this.$message.error('获取用户列表失败！')
        this.userList = res.data.users
        this.total = res.data.total

      },
      //监听修改用户框的关闭事件
      editDialogClose() {
        this.$refs.editFormRef.resetFields()
      },
      //修改用户信息并提交
      editUserInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return
          //发起修改用户信息请求
          const {data: res} = await this.$http.put('/users/' + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          if (res.meta.status != 200) return this.$message.error('更新用户失败')

          this.editDialogVisible = false
          this.$message.success('更新用户成功')
          this.getUserList()
        })
      },
      //删除用户
      async deleteUserById(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (confirmResult !== 'confirm') return this.$message.info('已取消删除')

        const {data:res} = await this.$http.delete('users/'+id)

        if (res.meta.status != 200) return this.$message.error('删除用户失败')

        this.$message.success('删除用户成功')

        this.getUserList()
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-pagination {
    margin-top: 10px;
  }

  .el-button {
    margin-left: 10px;
  }

  .box-card {
    margin-top: 15px;
  }

</style>