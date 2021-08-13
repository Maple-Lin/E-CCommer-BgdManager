<template>
  <el-container class="home-container">
    <!-- 头部栏 -->
  <el-header>
    <!-- logo -->
    <div class="home-logo">
       <a title="奋勇不息，砥砺前行">
        <img src="../assets/head.png" alt="logo">
      </a>
      <div class="QRcode">
        <i></i>
        <img src="../assets/myQR.jpg" alt="">
      </div>
    </div>
    <!-- 用户头像 -->
    <div class="avatar">
      <a class="avatar"><img src="" alt=""></a>
    </div>
    
  </el-header>
  <!-- 主体 -->
  <el-container>
    <!-- 侧边区域 -->
    <el-aside :width="isCollaps ? '64px': '200px'">
      <el-menu background-color="#0c1225" text-color="#fff" active-text-color="#409bff" unique-opened 
      :collapse="isCollaps" collapse-transition="false" router :default-active="activePath">
        <div class="toggle-btn" @click="toggleCollapse">|||</div>
      <!-- 一级菜单 -->
      <el-submenu :index="item.id.toString()" v-for="item in menulist" :key="item.id" menu-trigger>
        <template v-slot:title>
          <i :class="iconsObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="'/' + subitem.path" v-for="subitem in item.children" :key="subitem.id"
        @click="setNavState('/' + subitem.path)">
          <template v-slot:title>
          <i class="el-icon-location"></i>
          <span>{{subitem.authName}}</span>
        </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <!-- 内容栏 -->
    <el-container>
      <!-- 内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- 底边区域 -->
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</el-container>
</template>

<script>
export default {
  data() {
    return {
      // 侧菜单列表数据
      menulist: [],
      iconsObj: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju-tianchong',
        '145': 'iconfont icon-baobiao'
      },
      isCollaps: false,
      activePath: '',
    }
  },
  
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath');//获取存储在sessionstore的activePath值
  },

  methods: {
    //获取菜单数据
    getMenuList: async function() {
      const {data: res} = await this.$axios.get('menus');
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
      // console.log(res.data);
    },
    //切换菜单折叠与展开
    toggleCollapse: function() {
      this.isCollaps = !this.isCollaps;
    },
    //保存侧菜单链接激活状态
    setNavState: function(activePath) {
      window.sessionStorage.setItem('activePath', activePath);
      this.activePath = activePath;
    }
  },
}
</script>

<style lang="less" scoped>

.home-container {
  height: 100%;
}
  .el-header {
    display: flex;
    justify-content: space-between;
    background-color: #373d41;
    align-items: center;
    
    .home-logo {
      position: relative;
      width: 50px;
      height: 50px;
      > a {
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 100%;
        cursor: pointer;
        > img {
          width: 100%;
          border-radius: 50%;
        }
      }
      .QRcode {
        position: absolute;
        width: 150px;
        height: 150px;
        left: 0%;
        bottom: -323%;
        background-color: hsl(180, 5%, 96%);
        border-radius: 10%;
        opacity: 0;
        transition: 0.5s;
        -webkit-transition: .5s;
        -moz-transition: .5s;
        > i {
          position: absolute;
          left: 50%;
          top: -5px;
          transform: translate(-50%);
          width: 0px;
          height: 0px;
          border-bottom: 5px solid hsl(180, 5%, 96%);
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          
        }
        > img {
          width: 100%;
          height: 100%;
          border-radius: 10%;
        }
      }
      &:hover .QRcode {
        opacity: 1;
        z-index: 10;
      }
    }
    
    .avatar {
      display: block;
      width: 30px;
      height: 30px;
      background-color: blue;
      border-radius: 50%;
    }
  }

  .el-aside {
    background-color: #0c1225;
    .iconfont {
      margin-right: 10px;
    }
    .el-menu {
      border-right: none;
      .toggle-btn {
        background-color: #4a5064;
        color: #fff;
        font-size: 10px;
        text-align: center;
        cursor: pointer;
      }
    } 
    
  }

  .el-main {
    background-color: #eaedf1;
  }
  .el-footer {
    background-color: #373d41;
  }

</style>