<template>
  <div id="login">
    <div class="login-box">
      <div class="login-img">
        <img src="~assets/logo.png" alt="">
      </div>
      <el-form label-width="0px" :model="userInfo" :rules="rules" ref="loginForm">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" placeholder="请输入用户名" v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" placeholder="请输入密码" type="password" v-model="userInfo.password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data(){
      return {
        userInfo:{
          username:'admin',
          password:'123456'
        },
        // 增加表单验证
        rules:{
          username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      // 点击重置表单
      resetLogin(){
        this.$refs.loginForm.resetFields();
      },
      // 点击登录
      login(){
        // 对表单进行效验
        this.$refs.loginForm.validate( async(valid) => {
          if(!valid) return this.$message.error('登录失败');
          await this.$http.post('/login',this.userInfo).then((res)=>{
            if(res.data.meta.status !== 200) return
            // 记录token
            window.sessionStorage.setItem('token',res.data.data.token)
          });
          // 弹出登录成功
          this.$message.success('登录成功');
          // 跳转到home页
          this.$router.push('/home');
        })
      }
    }
  }
</script>

<style scoped>
  #login {
    width:100%;
    height:100%;
    background-color: #2b4b6b;
  }
  .login-box {
    width:600px;
    height:400px;
    background-color: #fff;
    border-radius:10px;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
  }
  .login-img {
    width:150px;
    height:150px;
    border-radius: 50%;
    padding:10px;
    border:2px solid #eee;
    box-sizing: border-box;
    box-shadow: 0 0 2px;
    position: absolute;
    left:50%;
    transform:translate(-50%,-50%);
    background-color: #fff;
  }
  .login-img img {
    background-color: #eee;
    width:100%;
    height:100%;
    border-radius: 50%;
  }
  .el-form {
    margin-top:100px;
    padding:40px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
</style>
