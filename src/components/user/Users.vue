<template>
  <div class="user">
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserInfo">
            <el-button slot="append" icon="el-icon-search" @click="getUserInfo"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddUser = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="userList"
        stripe
        style="width: 100%">
        <el-table-column
          type="index"
          label="#">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色">
        </el-table-column>
        <el-table-column
          prop="mg_state"
          label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
              >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUsers(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <!--添加用户界面-->
      <el-dialog title="添加用户" :visible.sync="showAddUser" width="40%" @close="addUserClose">
        <el-form :model="addUser" status-icon :rules="userRules" ref="addUserForm" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUser.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input  v-model="addUser.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input  v-model="addUser.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input  v-model="addUser.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showAddUser = false">取 消</el-button>
          <el-button type="primary" @click="addUsers">确 定</el-button>
        </span>
      </el-dialog>

      <!--修改用户界面-->
      <el-dialog title="修改用户" :visible.sync="showEditUser" width="40%" :before-close="editUserClose">
        <el-form :model="editUser" status-icon :rules="userRules" ref="editUserForm" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editUser.username" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input  v-model="editUser.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input  v-model="editUser.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showEditUser = false">取 消</el-button>
          <el-button type="primary" @click="editUserForm">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "Users",
    data(){
      return {
        queryInfo:{
          query:'',
          pagenum:1,
          pagesize:2
        },
        userList:[],
        total:0,
        showAddUser: false,
        showEditUser:false,
        addUser:{
          username:'',
          password:'',
          email:'',
          mobile:''
        },
        editUser:{
          username:'',
          id:'',
          email:'',
          mobile:''
        },
        userRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
          email: [
            { validator: this.checkEmail, trigger: 'blur' }
          ],
          mobile: [
            { validator: this.checkMobile, trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      // 获取数据
      async getUserInfo(){
        const {data:res} = await this.$http.get('users',{params:this.queryInfo})
        if (res.meta.status != 200) return this.$message.error('数据请求失败')
        this.userList = res.data.users;
        this.total = res.data.total;
      },
      // 改变一页显示几个
      handleSizeChange(size){
        this.queryInfo.pagesize = size;
        this.getUserInfo();
      },
      // 改变页码
      handleCurrentChange(index){
        this.queryInfo.pagenum = index;
        this.getUserInfo();
      },
      // 改变用户状态
      async userStateChange(info){
        const {data:res} = await this.$http.put(`users/${info.id}/state/${info.mg_state}`)
        if(res.meta.status != 200) {
          info.mg_state = !info.mg_state;
          return this.$message.error('用户状态修改失败')
        }
      },
      // 添加用户
      addUserClose(){
        this.$refs.addUserForm.resetFields();
      },
      addUsers(){
        this.$refs.addUserForm.validate(async (valid)=>{
          if(!valid) return;
          const {data:res} = await this.$http.post('users',this.addUser);
          console.log(res)
          if(res.meta.status !== 201) return this.$message.error('添加用户失败');
          this.showAddUser = !this.showAddUser;
          this.$message.success('添加用户成功');
          this.getUserInfo();
        })
      },
      // 修改用户
      async editUsers(id){
        this.showEditUser = true;
        // 查询用户
        const {data:res} = await this.$http.get('users/'+id);
        this.editUser.username = res.data.username;
        this.editUser.id = res.data.id;
        this.editUser.email = res.data.email;
        this.editUser.mobile = res.data.mobile;
      },
      editUserClose(){
        this.showEditUser = false;
        this.$refs.editUserForm.resetFields();
      },
      editUserForm(){
        this.$refs.editUserForm.validate(async (valid) => {
          if (!valid) return;
          const {data:res} = await this.$http.put('users/'+this.editUser.id,{
            email:this.editUser.email,
            mobile:this.editUser.mobile});
          if(res.meta.status !== 200) return this.$message.error('修改用户失败')
          this.$message.success('修改用户成功');
          this.showEditUser = false;
          this.getUserInfo();
        })
      },
      // 删除用户
      removeUser(id){
        // 弹框提示是否删除
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async ()=>{
          const {data:res} = await this.$http.delete(`users/${id}`)
          if (res.meta.status !== 200) return this.$message.error('删除失败')
          this.$message.success('用户删除成功')
          this.getUserInfo();
        }).catch(()=>{
          this.$message.info('取消删除')
        })
      },
      // 验证格式
      checkEmail(rule, value, callback){
        if(!value){
          return callback(new Error('邮箱不能为空'));
        }else{
          const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
          if(regEmail.test(value)){
            return callback();
          }else {
            return callback(new Error('请输入正确的邮箱'));
          }
        }
      },
      checkMobile(rule, value, callback){
        if(!value){
          return callback(new Error('手机号不能为空'));
        }else{
          const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
          if(regMobile.test(value)){
            return callback();
          }else {
            return callback(new Error('请输入正确手机号'));
          }
        }
      }
    },
    created(){
      this.getUserInfo();
    }
  }
</script>

<style scoped>

</style>
