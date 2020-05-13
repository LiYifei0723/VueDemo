<template>

  <el-container class="home-container">
    <!--头部区-->
    <el-header>
      <div>
        <img src="../../assets/img/logo.jpg" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <!--页面主题区域-->
    <el-container>
      <el-aside :width="!isCollapse?'200px':'64px'">
        <div class="toggle-button" @click="toggleButton">|||</div>
        <!--侧边菜单区域-->
        <el-menu
                background-color="#333744"
                text-color="#fff"
                active-text-color="rgb(64, 158, 255)"
                :unique-opened='true'
                :collapse="isCollapse"
                :collapse-transition="false"
                router
                :default-active="this.$route.path">

          <!--一级菜单-->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <!--一级菜单的模板区域-->
            <template slot="title">
              <!--图标-->
              <i :class="iconsObj[item.id]"></i>
              <!--文本-->
              <span>{{item.authName}}</span>
            </template>

            <!--二级菜单-->
            <el-menu-item :index="'/'+children.path+''" v-for="children in item.children" :key="children.id">
              <template slot="title">
                <!--图标-->
                <i class="el-icon-menu"></i>
                <!--文本-->
                <span>{{children.authName }}</span>
              </template>
            </el-menu-item>

          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧主题区-->
      <el-main class="el-main">
        <!--主题部分组件-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
  export default {
    name: "Home",
    data() {
      return {
        //左侧菜单数据
        menulist: [],
        iconsObj: {
          '125': 'iconfont icon-users',
          '103': 'iconfont icon-tijikongjian',
          '101': 'iconfont icon-shangpin',
          '102': 'iconfont icon-danju',
          '145': 'iconfont icon-baobiao'
        },
        //折叠侧边栏
        isCollapse: false
      }
    },
    methods: {
      loginOut() {
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      //获取左侧菜单的数据
      async getMenuList() {
        const {data: res} = await this.$http.get('menus')
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menulist = res.data
      },
      toggleButton() {
        this.isCollapse = !this.isCollapse
      }
    },
    created() {
      this.getMenuList()
    }
  }

</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-submenu i {
    margin-right: 15px;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #ffffff;
    font-size: 20px;

    > div {
      display: flex;
      align-items: center;

      span {
        margin-left: 15px;
      }

      img {
        height: 60px;
        list-style: circle;
        border-radius: 50%;
      }
    }

  }


  .el-aside {
    background-color: #333744;

    .el-menu {
      border-right: none;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }

  .toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #ffffff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;

  }
</style>