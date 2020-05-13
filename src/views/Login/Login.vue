<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像区域-->
      <div class="avatar_box">
        <img src="../../assets/img/logo.jpg" alt="">
      </div>
      <!--表单区域-->
      <el-form :model="loginForm" ref="loginFormRef" :rules="loginFormRules" label-width="0" class="login_form">
        <!--用户名-->
        <el-form-item prop="username">
          <el-input v-model='loginForm.username' prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input v-model='loginForm.password' prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <!--按钮区域-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import router from "../../router";

  export default {
    name: "Login",
    data() {
      return {
        //登录表单的数据绑定对象
        loginForm: {
          username: 'admin',
          password: '123456',
        },
        //登录表单验证
        loginFormRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 15, message: '长度在 6 到 15个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      //重置表单
      resetForm() {
        this.$refs.loginFormRef.resetFields()
      },
      //登录表单
      login() {
        this.$refs.loginFormRef.validate(async valid => {
          if (!valid) return;
          //新写法{data：res} 表示获取的数据中的data属性，重名为res
          const {data: res} = await this.$http.post('login', this.loginForm)
          if (res.meta.status !== 200) return this.$message.error('登陆失败')
          this.$message.success('登陆成功')
          //1.将登录之后的token，保存到客户端的sessionStorage中
          //1.1  项目中除了登录以外的其他API接口，必须在登录之后才能访问(路由导航守卫控制访问权限)
          //在index.js中实现
          //1.2token只能在当前网页打开期间生效，所以将token保存在sessionStorage中
          window.sessionStorage.setItem('token', res.data.token);
          //2.通过编程式导航跳转到后台主页，路由地址是/home
          this.$router.push('/home')

        })
      }
    }
  }
</script>

<style lang="less" scoped>

  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 304px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>