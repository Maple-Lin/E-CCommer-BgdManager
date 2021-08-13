<template>
  <!-- 面包屑 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片试图 -->
  <el-card >
    <!-- 搜索添加 -->
    <el-row :gutter="150">
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-button type="primary" round @click="addDialogVisible = true">添加</el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getuserList">
            <template v-slot:append>
              <el-button icon="el-icon-search" @click="getuserList"></el-button>
            </template>
          </el-input>
        </div>
      </el-col>
    </el-row>
    <!-- 用户列表 -->
    <el-table :data="userList" border stripe>
      <el-table-column type="index" label="ID"></el-table-column>
      <el-table-column prop="username" label="Name" ></el-table-column>
      <el-table-column prop="email" label="E-mail"></el-table-column>
      <el-table-column prop="mobile" label="Telephone"></el-table-column>
      <el-table-column prop="role_name" label="Role"></el-table-column>
      <el-table-column prop="mg_state" label="Status">
        <template v-slot="scope">
          <el-switch v-model="scope.row.mg_state" @change="userStatusChanged(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="Operation">
        <template v-slot="scope">
          <!-- 修改 -->
           <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="showEditDialogVisible(scope.row.id)"></el-button>
          <!-- 删除 -->
          <el-button type="danger" icon="el-icon-delete" circle @click="removeUserById(scope.row.id)"></el-button>
          <!-- 分配角色 -->
          <el-tooltip class="item" effect="dark" content="角色分配" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-star-off" circle ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum" :page-sizes="[2,5, 10, 20, 50]" :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </el-card>
  <!-- 添加用户对话框 -->
  <el-dialog title="添加用户" v-model=addDialogVisible width="35%" @close="addDialogClosed">
    <!-- 内容 -->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="addForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <!-- 底部 -->
    <template v-slot:footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 用户修改对话框 -->
  <el-dialog title="修改用户信息" v-model=editDialogVisible width="40%" @close="editDialogClosed">
  <el-form :model="editForm" :rules="editFormrules" ref="editFormRef" label-width="100px">
    <el-form-item label="Name" prop="username">
      <el-input v-model="editForm.username" disabled></el-input>
    </el-form-item> 
    <el-form-item label="E-mail" prop="email">
      <el-input v-model="editForm.email"></el-input>
    </el-form-item> 
    <el-form-item label="Mobile" prop="mobile">
      <el-input v-model="editForm.mobile"></el-input>
    </el-form-item> 
  </el-form>
  <template v-slot:footer>
    <span class="dialog-footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editUser">确 定</el-button>
    </span>
  </template>
  
</el-dialog>
</template>
<script>
export default {
  created() {
    this.getuserList();
  },

  data() {
    // 正则表达式验证邮箱格式
    let checkEmail = (rules, value, callback) => {
      const regExpEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if(regExpEmail.test(value)) {
        return callback();
      }
      callback(new Error('邮箱输入格式错误！'));
    };
    
    // 正则表达式验证手机号格式
    let checkMobile = (rule, value, callback) => {
      var regExpMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if(regExpMobile.test(value)) {
        return callback();
      }
      callback(new Error('手机号输入格式错误！'));
    };
    
    return {
      //获取用户列表数据对象
      queryInfo: {
        query: '',
        pagenum: 1,//当前的页数
        pagesize: 2,//当前显示多少条数据
      },
      userList: [],
      total: 0,
      // 添加用户对话框的显示与隐藏
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 添加用户输入信息验证
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail,  trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile,  trigger: 'blur' }
        ],
      },
      // 修改用户信息
      editDialogVisible: false,
      editForm: {},
       editFormrules: {
          email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail,  trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile,  trigger: 'blur' }
        ],
       }
    }
  },

  methods: {
    // 获取用户数据
    getuserList: async function() {
      const { data: res } = await this.$axios.get('users', { params: this.queryInfo });
      // console.log(res);
    if(res.meta.status !== 200 ){
      return this.$message.error('获取数据失败！');
    } else{
      this.userList = res.data.users;
      this.total = res.data.total;
    }    
    },
    // 监听pagesize改变事件
    handleSizeChange: function(val) {
        // console.log(`每页 ${val} 条`);
        this.queryInfo.pagesize = val;
        this.getuserList();
      },
    // 监听页码值改变事件
    handleCurrentChange: function(val) {
        // console.log(`当前页: ${val}`);
        this.queryInfo.pagenum = val;
        this.getuserList();
      },

      // 用户switch开关状态改变
      userStatusChanged: async function(userInfo) {
        // console.log(userInfo);
        const {data: res} = await this.$axios.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
        if(res.meta.status !== 200){
          userInfo.mg_state = !userInfo.mg_state;//修改不成功，switch状态不变
          return this.$message.error('更改用户状态失败!');
        }else{
          return this.$message.success('更改用户状态成功!');
        }
      },

      // 监听添加用户对话框关闭
      addDialogClosed: function() {
        this.$refs.addFormRef.resetFields();
      },

      // 确认添加用户
      addUser:  function() {
        this.$refs.addFormRef.validate( async valid => {
          console.log(valid);
          if(!valid)  return this.$message.error('输入错误，请重新输入！');
            const { data: res } = await this.$axios.post('users', this.addForm);
            console.log(res);
            this.addDialogVisible = false;
            this.getuserList();

        });
      },
      // 根据ID获取对应用户信息并打开对话框
      showEditDialogVisible: async function(id) {
        const { data: res } = await this.$axios.get(`users/${id}`);
        if(res.meta.status !== 200) return this.$message.error('查询此用户失败');
        this.editForm = res.data;
        this.editDialogVisible = true;
      },
      // 监听修改用户对话框关闭
      showeditDialogClosed: function() {
        this.$refs.editFormRef.resetFields();
      },
      // 修改用户预验证
      editUser: function() {
        this.$refs.editFormRef.validate( async valid => {
          // console.log(valid);
          if(!valid)  return this.$message.error('修改失败，请重新输入！');
          // 验证格式成功，提交修改内容
            const { data: res } = await this.$axios.put('users/' + this.editForm.id, 
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          });
          if(res.meta.status !== 200) return this.$message.error('用户信息修改失败!');
          this.editDialogVisible = false;
          this.getuserList();
          this.$message.error('用户信息已更新');
        });
      },

      // 删除用户信息确认
      removeUserById: async function(id) {
        const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => {
          return err;
        });
        // 确认：confirm   取消： cancel
        if(result !== 'confirm') {
          return this.$message.info('已取消删除');
        }
        const { data: res } = await this.$axios.delete('users/' + id);
        console.log(res);
        if(res.meta.status !== 200) return this.$message.info('删除失败!');
        this.$message.success('删除用户成功');
        this.getuserList();
      }
  }
}
</script>

<style lang="less" scoped>

</style>