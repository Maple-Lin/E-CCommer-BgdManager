<template>
  <!-- 面包屑 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色管理</el-breadcrumb-item>
  </el-breadcrumb>

    <!-- 卡片试图 -->
  <el-card >
    <el-row>
      <el-col>
        <el-button type="primary">添加角色</el-button>
      </el-col>
    </el-row>

    <el-table :data="rolesList" border stripe>
      <el-table-column type="expand" >
        <template v-slot="scopes">
          <el-row :class="['bd-bottom', index_1 === 0 ? 'bd-top' : '', 'vcenter']" v-for="(itmes_1, index_1) in scopes.row.children" :key="itmes_1.id">
            <!-- 一级权限 -->
            <el-col :span="5">
              <el-tag>{{itmes_1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 二级权限 -->
            <el-col :span="19">
              <el-row :class="[index_2 === 0 ? '' : 'bd-top', 'vcenter']" v-for="(itmes_2, index_2) in itmes_1.children" :key="itmes_2.id">
                <el-col :span="6">
                  <el-tag type="success" class="rigths-one">{{itmes_2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 第三权限 -->
                <el-col :span="18">
                  <el-tag type="warning" v-for="item_3 in itmes_2.children" :key="item_3.id"
                  closable @close="removeRightsById(scopes.row, item_3.id)">{{item_3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="ID"></el-table-column>
      <el-table-column prop="roleName" label="名称" width="150px"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="300px"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scopes">
          <!-- 编辑 -->
           <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <!-- 删除 -->
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          <!-- 分配权限 -->
          <el-button @click="showSetDialogVisible(scopes.row)" type="warning" icon="el-icon-star-off" size="mini">权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!-- 分配权限对话框 -->
  <el-dialog title="提示" v-model="dialogVisible" width="50%" @close="closeSetDialogVisible">
  <el-tree :data="rolesTree" :props="treeProps" 
  show-checkbox node-key="id" default-expand-all 
  :default-checked-keys="defKeys"
  ref="treeRef"></el-tree>
  <template v-slot:footer>
    <span class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="allKeysId">确 定</el-button>
    </span>
  </template>
</el-dialog>
</template>

<script>
export default {
  created() {
    this.getRolesList();
  },

  data() {
    return {
      // 所有权限列表
      rolesList: [],
      // 权限对话框显示与隐藏
      dialogVisible: false,
      rolesTree: [],  //  角色树
      treeProps: {    //树形控件的属性绑定对象
        label: 'authName',
        children: 'children',
      },
      defKeys: [],   //存储默认选中的节点id
      roleId: '',   //当前即将分配权限的角色id
    }
  },

  methods: {
    // 获取角色链表
    getRolesList: async function () {
      const {data: res} = await this.$axios.get('roles');
      if(res.meta.status !== 200)   return this.$message.error('获取角色数据失败!');
      this.rolesList = res.data;
    },
    // 移除权限
    removeRightsById: async function(role, rightId) {
       const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => {
          return err;
        });
        if(result !== 'confirm')  return;
        const { data: res } = await this.$axios.delete(`roles/${role.id}/rights/${rightId}`);
        if(res.meta.status !== 200)   return;
        role.children = res.data;
    },

    // 分配权限对话框
    showSetDialogVisible: async function(role) {
      this.roleId = role.id;

      const { data: res } = await this.$axios.get('rights/tree');
      if(res.meta.status !== 200)   return this.$message.error('获取权限数据失败!');
      this.rolesTree = res.data;
      this.getThreeDefKeys(role, this.defKeys);
      this.dialogVisible = true;
    },
    // 通过递归方式，获取对应角色下的所有三级权限的id，并将id保存到defKeys数组中
    getThreeDefKeys: function(node, arr) {
      if(!node.children) {    //三级节点没有children
        return arr.push(node.id);
      }
      node.children.forEach( item => this.getThreeDefKeys(item, arr))
    },
    // 清除defKeys数据
    closeSetDialogVisible: function() {
      this.defKeys = [];
    },
    // // 为角色分配权限
    allKeysId: async function() {
      const arrKeys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()];
      const idStr = arrKeys.join();
      const { data: res } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids: idStr});
      if(res.meta.status !== 200)   return this.$message.error('分配权限失败！');
      this.$message.success('分配权限成功');
      this.getRolesList();
      this.dialogVisible = false;
    }
  }
}
</script>

<style lang="less" scoped>
  .bd-bottom {
    border-bottom: 1px solid #eee;
  }

  .bd-top {
    border-top: 1px solid #eee;
  }

  .el-tag {
    margin: 7px;
  }
  
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>