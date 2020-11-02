<template>
  <el-container class="home-container">
    <!--头部-->
    <el-header>
      <div>
        <img src="~assets/logo.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="quit">退出</el-button>
    </el-header>
    <!--主体-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-buttom" @click="toggleList">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse-transition="false"
          :collapse="isCollapse"
          :router="true"
          :default-active="navActive">
          <el-submenu :index="item.id+''" v-for="(item,index) in menuList" :key="item.id">
            <!--一级菜单-->
            <template slot="title">
              <!--图标-->
              <i :class=listIcon[index]></i>
              <!--文本-->
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="'/' + items.path" v-for="items in item.children" :key="items.id" @click="saveNavActive(items.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{items.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--内容-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "Home",
    data(){
      return {
        menuList:[],
        listIcon:['el-icon-s-custom','el-icon-s-check','el-icon-s-shop','el-icon-s-claim','el-icon-s-data'],
        isCollapse: false,
        navActive:''
      }
    },
    methods:{
      quit(){
        window.sessionStorage.clear();
        this.$router.push('/login')
      },
      async getMenuList(){
        const {data} = await this.$http.get('/menus')
        if(data.meta.status != 200) return this.$message.error(data.meta.msg);
        this.menuList = data.data;
        console.log(this.menuList)
      },
      // 点击切换列表的折叠
      toggleList(){
        this.isCollapse = ! this.isCollapse;
      },
      saveNavActive(path){
        window.sessionStorage.setItem('active',path);
        this.navActive = '/' + path;
      }
    },
    created(){
      // 获取菜单数据
      this.getMenuList();
      // 获取高亮
      this.navActive = '/'+ window.sessionStorage.getItem('active');
    }
  }
</script>

<style scoped>
  .home-container {
    width:100%;
    height:100%;
  }
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    color: #fff;
  }
  .el-header div {
    display: flex;
    align-items: center;
  }
  .el-header div img {
    width:45px;
    height:45px;
    margin-right:20px;
  }
  .el-aside {
    background-color: #333744;
  }
  .el-main {
    background-color: #eaedf1;
  }
  .el-aside {
    transition: width .3s ease;
  }
  .el-aside span {
    margin-left: 10px;
  }
  .el-aside .el-menu {
    border-right: none;
  }
  .toggle-buttom {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
