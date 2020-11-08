<template>
  <div class="roles-list">
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片区-->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button @click="showAddRoles = true" type="primary">添加角色</el-button>
        </el-col>
        <el-col>
          <el-table :data="rolesList" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template v-slot="slot">
                <el-row v-for="(item1,index1) in slot.row.children"
                        :class="['vcenter','border-bottom',index1 == 0 ? 'border-top':'']"
                        :key="item1.id">
                  <!--一级权限-->
                  <el-col :span="5">
                    <el-tag closable @close="deleteRoles(slot.row,item1.id)">{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!--二三级权限-->
                  <el-col :span="19">
                    <el-row v-for="(item2,index2) in item1.children"
                            :class="['vcenter',index2 == 0 ? '': 'border-top']"
                            :key="item2.id">
                      <!--二级权限-->
                      <el-col  :span="10" >
                        <el-tag type="success" closable @close="deleteRoles(slot.row,item2.id)">{{item2.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <!--三级权限-->
                      <el-col :span="14">
                        <el-tag type="warning"
                                v-for="(item3) in item2.children"
                                closable
                                :key="item3.id"
                                @close="deleteRoles(slot.row,item3.id)">
                          {{item3.authName}}
                        </el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="roleName" label="角色名称" ></el-table-column>
            <el-table-column prop="roleDesc" label="角色描述" ></el-table-column>
            <el-table-column prop="level" label="操作">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoles(scope.row.id)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoles(scope.row.id)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
                  <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRights(scope.row)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>

    <!--添加用户界面-->
    <el-dialog title="添加角色" :visible.sync="showAddRoles" width="40%" @close="addRolesClose">
      <el-form :model="queryAddRoles" status-icon ref="addRolesForm" label-width="100px" :rules="rolesRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryAddRoles.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input  v-model="queryAddRoles.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="showAddRoles = false">取 消</el-button>
          <el-button type="primary" @click="addRolesForm">确 定</el-button>
        </span>
    </el-dialog>

    <!--修改用户界面-->
    <el-dialog title="修改角色" :visible.sync="showEditRoles" width="40%" :before-close="editRolesClose">
      <el-form :model="queryEditRoles" status-icon ref="editRolesForm" label-width="100px" :rules="rolesRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryEditRoles.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input  v-model="queryEditRoles.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="showEditRoles = false">取 消</el-button>
          <el-button type="primary" @click="editRolesForm">确 定</el-button>
        </span>
    </el-dialog>

    <!--分配权限界面-->
    <el-dialog title="分配权限" :visible.sync="showSetRights" width="40%" @close="setRightsClose">
      <!--树形控件-->
      <el-tree :data="allRights" :props="defaultProps"
               default-expand-all show-checkbox
               :default-checked-keys="ckeckedRights"
               node-key="id" ref="rightsTree"></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightsClose">取 消</el-button>
    <el-button type="primary" @click="setRightsClick">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Roles",
    data(){
      return {
        rolesList:[],
        showEditRoles:false,
        showAddRoles:false,
        showSetRights:false,
        queryAddRoles:{
          roleName:'',
          roleDesc:''
        },
        queryEditRoles:{
          id:'',
          roleName:'',
          roleDesc:''
        },
        // 请求所有的权限
        allRights:[],
        defaultProps: {
          children: 'children',
          label: 'authName'
        },
        ckeckedRights:[],
        rightsId:'',
        rolesRules:{
          roleName:[ { required: true, message: '请输入角色名', trigger: 'blur' }],
          roleDesc:[ { required: false, trigger: 'blur' }]
        }
      }
    },
    methods:{
      async getRolesList(){
        const {data:res} = await this.$http.get('roles');
        if(res.meta.status!==200) return this.$message.error('数据获取失败');
        this.rolesList = res.data;
      },
      // 添加角色
      async addRolesForm(){
        this.$refs.addRolesForm.validate(async (valid) => {
          if (!valid) return;
          const {data:res} = await this.$http.post('roles/',{
            roleName:this.queryAddRoles.roleName,
            roleDesc:this.queryAddRoles.roleDesc});
          if(res.meta.status !== 201) return this.$message.error('添加角色失败')
          this.$message.success('添加角色成功');
          this.showAddRoles = false;
          this.getRolesList()
        })
      },
      addRolesClose(){
        this.showAddRoles = false;
        this.$refs.addRolesForm.resetFields();
      },
      // 编辑角色
      async editRoles(id){
        const {data:res} = await this.$http.get('roles/'+id);
        if(res.meta.status !== 200) return;
        this.queryEditRoles.id = res.data.roleId;
        this.queryEditRoles.roleName = res.data.roleName;
        this.queryEditRoles.roleDesc = res.data.roleDesc;
        this.showEditRoles = true
      },
      editRolesClose(){
        this.showEditRoles = false
      },
      async editRolesForm(){
        this.$refs.editRolesForm.validate(async (valid) => {
          if (!valid) return;
          const {data:res} = await this.$http.put('roles/'+this.queryEditRoles.id,{
            roleName:this.queryEditRoles.roleName,
            roleDesc:this.queryEditRoles.roleDesc});
          if(res.meta.status !== 200) return this.$message.error('修改角色失败')
          this.$message.success('修改角色成功');
          this.showEditRoles = false
          this.getRolesList()
        })
      },
      // 删除角色
      removeRoles(id){
        // 弹框提示是否删除
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async ()=>{
          const {data:res} = await this.$http.delete(`roles/${id}`)
          if (res.meta.status !== 200) return this.$message.error('删除失败')
          this.$message.success('角色删除成功')
          this.getRolesList();
        }).catch(()=>{
          this.$message.info('取消删除')
        })
      },
      // 删除指定权限
      deleteRoles(row,id){
        // 弹框提示是否删除
        this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async ()=>{
          const{data:res} = await this.$http.delete(`roles/${row.id}/rights/${id}`);
          if (res.meta.status !== 200) return;
          this.$message.success('删除成功')
          // 重新赋值返回的新权限
          row.children = res.data;
        }).catch(()=>{
          this.$message.info('取消删除')
        })
      },
      // 分配权限
      async setRights(rights){
        this.rightsId = rights.id;
        this.showSetRights = true;
        // 拿到所有的权限
        const {data:res} = await this.$http.get('rights/tree');
        if (res.meta.status !== 200) return;
        this.allRights = res.data;
        this.filterRights(rights,this.ckeckedRights);
      },
      setRightsClose(){
        this.ckeckedRights = [];
        this.showSetRights = false;
      },
      async setRightsClick(){
        const keys = [...this.$refs.rightsTree.getCheckedKeys(),
          ...this.$refs.rightsTree.getHalfCheckedKeys()]
        const rightsStr = keys.join(',');
        const {data:res} = await this.$http.post(`roles/${this.rightsId}/rights`,{rids:rightsStr});
        if(res.meta.status !== 200) return this.$message.error('权限分配失败');
        this.$message.success('权限分配成功');
        this.showSetRights = false;
        this.getRolesList()
      },
      // 设置一个递归函数把所有的三级权限筛选出来
      filterRights(node,arr){
        if(!node.children){
          return arr.push(node.id);
        }
        node.children.forEach(item => {
          this.filterRights(item,arr)
        })
      }
    },
    created(){
      this.getRolesList()
    }
  }
</script>

<style scoped>
  .border-top {
    border-top:2px solid #eee;
  }
  .border-bottom {
    border-bottom:2px solid #eee;
  }
  .el-tag {
    margin:10px;
  }
  .vcenter{
    display: flex;
    align-items: center;
  }
</style>
