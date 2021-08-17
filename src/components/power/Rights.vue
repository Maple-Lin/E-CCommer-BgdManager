<template>
  <!-- 面包屑 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>

    <!-- 卡片试图 -->
  <el-card >
    <el-table :data="rightList" border stripe>
      <el-table-column type="index" label="ID"></el-table-column>
      <el-table-column prop="authName" label="权限名称" ></el-table-column>
      <el-table-column prop="path" label="权限路径" ></el-table-column>
      <el-table-column prop="level" label="权限等级" >
        <template v-slot="scopes">
          <el-tag v-if="scopes.row.level === '0'">一级</el-tag>
          <el-tag type="warning" v-if="scopes.row.level === '2'">三级</el-tag>
          <el-tag type="success" v-else-if="scopes.row.level === '1'">二级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  created() {
    this.getRightsList();
  },

  data() {
    return {
      rightList: [],
    }
  },

  methods: {
    getRightsList: async function() {
      const { data: res } = await this.$axios.get('rights/list');
      if(res.meta.status !== 200) return this.$message.error('获取权限列表失败!');
      this.rightList = res.data;
    }
  }
}
</script>

<style lang="less" scoped>

</style>