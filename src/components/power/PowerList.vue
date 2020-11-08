<template>
  <div class="power-list">
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片区-->
    <el-card class="box-card">
      <el-table :data="powerList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称" ></el-table-column>
        <el-table-column prop="path" label="权限路径" ></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="slot">
            <el-tag v-if="slot.row.level === '0'">等级一</el-tag>
            <el-tag type="success" v-else-if="slot.row.level === '1'">等级二</el-tag>
            <el-tag type="warning" v-else-if="slot.row.level === '2'">等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "PowerList",
    data(){
      return {
        powerList:[]
      }
    },
    created(){
      this.getPowerList();
    },
    methods:{
      async getPowerList(){
        const {data:res} = await this.$http.get('rights/list');
        this.powerList = res.data;
      }
    }
  }
</script>

<style scoped>

</style>
