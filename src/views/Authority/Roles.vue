<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary" @click="addRoleVisible = true">添加角色</el-button>
      <el-table border stripe :data="rolesList">
        <!--展开列-->
        <el-table-column type="expand" label="" width="50px">
          <template slot-scope="scope">
            <!--栅格系统，对权限进行划分-->
            <el-row :class="['bdbottom',i1 === 0 ? 'bdtop':'','vcenter']"
                    v-for="(item1 , i1) in scope.row.children"
                    :key="item1.id">
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag closable
                        @close="removeRightById(scope.row,item1.id)">
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二级和三级权限-->
              <el-col :span="19">
                <!--通过for循环，渲染二级权限-->
                <el-row :class="[i2 ===0 ?'':'bdtop','vcenter']"
                        v-for="(item2 , i2) in item1.children"
                        :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success"
                            closable
                            @close="removeRightById(scope.row,item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable
                            type="warning"
                            v-for="(item3,i3) in item2.children"
                            :key="item3.id"
                            @close="removeRightById(scope.row,item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
                prop="roleName"
                label="角色名称"
                width="300px">
        </el-table-column>
        <el-table-column
                prop="roleDesc"
                label="角色描述"
                width="300px">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--添加角色提示框-->
    <el-dialog title="添加角色" :visible.sync="addRoleVisible" @close="addRoleDialogClose">
      <el-form :model="addForm" ref="addFormRef" :rules="addFormRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input autocomplete="off" v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input autocomplete="off" v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleInfo">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改角色提示框-->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%" @click="editDialogClose">
      <el-form ref="editFormRef" label-width="70px" :model="editForm" :rules="addFormRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色信息" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible=false" :plain="true">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!--分配权限的对话框-->
    <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="50%"
            @close="setRightDialogClosed">
      <!--树形控件-->
      <el-tree :data="rightList"
               :props="treeProps"
               show-checkbox
               node-key="id"
               default-expand-all
               :default-checked-keys="defKeys"
               ref="treeRef">
      </el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary"
               @click="allotRigths">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Roles",
    data() {
      return {
        rolesList: [],
        addRoleVisible: false,
        addForm: {
          roleName: '',
          roleDesc: ''
        },
        addFormRules: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
          ],
          roleDesc: [
            {required: true, message: '请输入角色描述', trigger: 'blur'},
          ],
        },
        editDialogVisible: false,
        editForm: {},
        //控制分配权限的对话框
        setRightDialogVisible: false,
        //所有权限的数据
        rightList: [],
        //树形控件的属性绑定对象
        treeProps: {
          label: 'authName',
          children: 'children',
        },
        //默认选中的节点值的数组
        defKeys: [],
        //当前即将分配权限的id
        roleId: ''
      }
    },
    created() {
      this.getRolesList()
    },
    methods: {
      //获取角色列表
      async getRolesList() {
        const {data: res} = await this.$http.get('roles')
        if (res.meta.status !== 200) return this.$message.error('获取权限失败')
        this.rolesList = res.data
      },
      //添加角色
      async addRoleInfo() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return this.$message.error('请输入正确信息')
          //发起添加用户的网络请求
          const {data: res} = await this.$http.post('roles', this.addForm)

          if (res.meta.status !== 201) {
            this.$message.error('添加角色失败')
          }

          this.$message.success('添加角色成功')

          this.addRoleVisible = false
          this.getRolesList()
        })

      },
      //添加用户框关闭事件
      addRoleDialogClose() {
        this.$refs.addFormRef.resetFields()
      },
      //删除角色
      async deleteRole(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (confirmResult !== 'confirm') return this.$message.info('已取消删除')

        const {data: res} = await this.$http.delete('roles/' + id)

        if (res.meta.status != 200) return this.$message.error('删除角色失败')

        this.$message.success('删除用户成功')

        this.getRolesList()
      },
      //通过id获取角色数据
      async showEditDialog(roleId) {
        const {data: res} = await this.$http.get('roles/' + roleId)

        if (res.meta.status !== 200) return this.$message.error('查询用户信息失败')
        this.editForm = res.data
        this.editDialogVisible = true
      },
      //修改角色
      editUserInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return
          //发起修改用户信息请求
          const {data: res} = await this.$http.put('/roles/' + this.editForm.roleId, {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          })
          if (res.meta.status != 200) return this.$message.error('更新用户失败')
          this.editDialogVisible = false
          this.$message.success('更新用户成功')
          this.getRolesList()
        })
      },
      //修改角色框关闭事件
      editDialogClose() {
        this.$refs.editFormRef.resetFields()
      },
      //通过id删除标签
      async removeRightById(role, rightId) {
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
        const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)

        if (res.meta.status != 200) return this.$message.error('取消权限失败')

        this.$message.success('取消权限成功')

        role.children = res.data
      },
      //展示分配权限的对话框
      async showSetRightDialog(role) {
        this.roleId = role.id
        //获取所有权限数据
        const {data: res} = await this.$http.get('rights/tree')
        if (res.meta.status !== 200) return this.$message.error('获取权限数据失败')
        //获取的权限数据保存到rightList
        this.rightList = res.data
        //递归获取三级节点的id
        this.getLeafKeys(role, this.defKeys)
        this.setRightDialogVisible = true
      },
      //通过递归的形式获取角色下所有权限的id
      getLeafKeys(node, array) {
        if (!node.children) {
          return array.push(node.id)
        }
        node.children.forEach(item => this.getLeafKeys(item, array))
      },
      //关闭分配权限对话框
      setRightDialogClosed() {
        this.defKeys = []
      },
      //点击为角色分配权限
      async allotRigths() {
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys(),
        ]

        const idStr = keys.join(',')

        const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`,
            {rids: idStr})

        if (res.meta.status !== 200) return this.$message.error('分配权限失败')

        this.$message.success('分配权限成功')

        this.getRolesList()
        this.setRightDialogVisible = false
      }
    },
  }
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>