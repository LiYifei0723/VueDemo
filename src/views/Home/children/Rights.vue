<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card>
      <el-table
              :data="rightList"
              border
              style="width: 100%"
              stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
                prop="authName"
                label="权限名称"
                width="280">
        </el-table-column>
        <el-table-column
                prop="path"
                label="路径"
                width="280">
        </el-table-column>
        <el-table-column
                prop="level"
                label="等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == '0'">一级</el-tag>
            <el-tag type="success" v-if="scope.row.level == '1'">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.level == '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "Rights",
    data() {
      return {
        rightList: []
      }
    },
    //获取用户权限列表
    created() {
      this.getRightList()
    },
    methods: {
      //获取用户权限列表
      async getRightList() {
        const {data: res} = await this.$http.get('rights/list')
        if (res.meta.status != 200) return this.$message.error('获取权限列表失败')
        this.rightList = res.data
      },
    }
  }
</script>

<style lang="less" scoped>

</style>