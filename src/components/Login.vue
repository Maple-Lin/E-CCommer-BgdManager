<template>
 <div class="login_container">
   <!-- 头像 -->
   <div class="login_box">
     <div class="head_box">
       <img src="../assets/head.png" alt="logo">
     </div><i class="login_animation"></i>
     <!-- 表单 -->
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form">
      <!-- 用户名 -->
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user" placeholder="用户名"></el-input>
      </el-form-item>
      <!-- 用门户密码 -->
      <el-form-item prop="password">
        <el-input v-model="loginForm.password"  prefix-icon="iconfont icon-password" show-password placeholder="请输入密码..."></el-input>
      </el-form-item>
      <!-- 登录/重置 -->
      <el-form-item >
        <div class="login_btns">
          <el-button type="primary" @click="submitForm('loginFormRef')" round>登录</el-button>
          <el-button type="info" @click="resetForm('loginFormRef')" round >重置</el-button>
        </div>
      </el-form-item>
    </el-form>
    <!-- 第三方登录模块 -->
    <div class="Third-login">
      <ul >
        <li class="icon-zfb"><a src="" title="支付宝"></a></li>
        <li class="icon-qq"><a title="QQ"></a></li>
        <li class="icon-wb"><a title="微博"></a></li>
        <li class="icon-wx"><a title="微信"></a></li>
      </ul>
    </div>
   </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //数据绑定
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        //验证规则
        loginFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ]
        }
      }
    },

    methods: {
      submitForm(formName) {
        this.$refs[formName].validate( async (valid) => {
          if (valid) {
            // console.log('Success submit');
            const {data: res} = await this.$axios.post('login', this.loginForm); 
            if(res.meta.status != 200){
              this.$message.error('登录失败,请重新输入...');
            }else{
              this.$message.success('登录成功');
              window.sessionStorage.setItem("token", res.data.token);
              this.$router.push('/home');
            }
          } else {
            // console.log('error submit!!');
            return false;
          }
        });
      },

      resetForm(formName) {
        // console.log(this.$refs);
    this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style lang="less" scoped>
  .login_container {
    height: 100%;
    background: url(../assets/login_bg.jpg) no-repeat fixed center 0;
    background-size: cover; 
    -webkit-background-size: cover;/* 兼容Webkit内核浏览器如Chrome和Safari */ 
    -o-background-size: cover;/* 兼容Opera */ 
    zoom: 1; 

    .login_box {
      width: 350px;
      height: 300px;
      background-color: rgba(217, 220, 223, 0.5);
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border-radius: 4px;
      
      .head_box {
        width: 100px;
        height: 100px;
        border: 1px solid rgb(180, 176, 176);
        border-radius: 50%;
        padding: 5px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        top: -20%;
        transform: translate(-50%);
        z-index: 1;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          background-color: #ddd;
          border-radius: 50%;
          transition: all .5s;
          &:hover {
            transform: scale(1.5);
          }
        }
      
        
      }
      i {
        display: block;
        width: 105px;
        height: 96px;
        position: absolute;
        left: 50%;
        top: -19%;
        transform: translate(-50%);
        border-radius: 50%;
        box-shadow: 0 0 12px rgb(235, 231, 231);
        animation: pulse 2s linear infinite;
      }
      @keyframes pulse {
        0% {
        }
        70% {
            /* transform: scale(5);  不要用scale 因为他会让 阴影变大*/
            width: 90px;
            height: 90px;
            opacity: 1;
        }
        100% {
            width: 100px;
            height: 100px;
            opacity: 0;
        }
      }

      .login_form {
        width: 100%;
        position: absolute;
        top: 20%;
        padding: 0 20px;
        .login_btns {
          display: flex;
          justify-content: flex-end;
        }
      }

      .Third-login{
        position: absolute;
        bottom: -30px;
        left: -100px;
        > ul {
          display: flex;
          justify-content: space-around;
          > li {
          width: 30px;
          height: 30px;
          margin-left: 20px;
          background: url(../assets/un_login_third.png) no-repeat 0 0;
          cursor: pointer;
          transition: all .5s;
          > a {
            width: 100%;
            height: 100%;
          }
          &:hover {
          background-position: 0 -35px;
          transform: scale(1.5);
          }
        }
        .icon-qq {
          background-position: -35px 0;
          &:hover {
          background-position: -35px -35px;
          }
        }
         .icon-wb {
          background-position: -105px 0;
          &:hover {
          background-position: -105px -35px;
          }
        }
        .icon-wx {
          background-position: -140px 0;
          &:hover {
          background-position: -140px -35px;
          }
        }
       
        }
      
      
      }
    }
  }
</style>
