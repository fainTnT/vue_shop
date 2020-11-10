<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片区-->
    <el-card class="box-card">
      <el-row>
        <el-col class="add-cate">
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
        <!--表格区-->
        <el-col>
          <el-table
            :data="allCate"
            style="width: 100%;margin-bottom: 20px;"
            row-key="cat_id"
            border
            :default-expand-all="false"
            :tree-props="{hasChildren: 'hasChildren',children:'children'}">
            <!--lazy-->
            <!--:load="load"-->
            <el-table-column prop="cat_name" label="分类名称"  width="350"></el-table-column>
            <el-table-column prop="cat_deleted" label="是否有效"  width="150">
              <template v-slot="slot">
                <i class="el-icon-success" v-if="!slot.row.cat_deleted"></i>
                <i class="el-icon-error" v-else></i>
              </template>
            </el-table-column>
            <el-table-column prop="cat_level" label="排序">
              <template v-slot="slot">
                <el-tag v-if="slot.row.cat_level == 0">等级一</el-tag>
                <el-tag type="success" v-else-if="slot.row.cat_level == 1">等级二</el-tag>
                <el-tag type="danger" v-else>等级三</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="slot">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(slot.row.cat_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(slot.row.cat_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!--分页-->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[3, 5, 10, 15]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>

    <!--添加分类页面-->
    <el-dialog title="添加分类" :visible.sync="showAddCate" width="40%" @close="addCateClose">
      <el-form :model="addCateForm" status-icon :rules="addCateRules" ref="addCateForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input type="text" v-model="addCateForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <!--级联选择器-->
        <el-form-item label="父级分类">
          <el-cascader
            v-model="cateId"
            :options="queryCateLists"
            :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id',children:'children',checkStrictly:true }"
            style="width:100%"
            @change="addCateChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddCate = false">取 消</el-button>
        <el-button type="primary" @click="queryAddCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类的对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="50%">
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidtCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Categories",
    data(){
      return {
        queryInfo:{
          type: 3,
          pagenum:1,
          pagesize:5
        },
        allCate:[],
        total: 0,
        showAddCate: false,
        addCateForm:{
          cat_pid: '0',
          cat_name:'',
          cat_level:'0'
        },
        queryCateLists:[],
        cateId:[],
        addCateRules:{
          cat_name:[{ required: true, message: '请输入分类名', trigger: 'blur' }]
        },
        // 编辑对话框 控制
        editCateDialogVisible: false,
        // 编辑分类表单验证
        editCateFormRules: {
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        },
        // 编辑表单 绑定对象
        editCateForm: ''
      }
    },
    methods:{
      async getCateList(){
        const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
        if(res.meta.status !== 200) return;
        this.allCate = res.data.result;
        this.total = res.data.total;
        // this.addHasChildren(this.allCate);
      },
      handleSizeChange(newsize){
        this.queryInfo.pagesize = newsize;
        this.getCateList();
      },
      handleCurrentChange(newpage){
        this.queryInfo.pagenum = newpage;
        this.getCateList();
      },
      // 添加分类
      addCate(){
        this.showAddCate = true;
        this.queryCateList();
      },
      addCateClose(){
        this.showAddCate = false;
        this.$refs.addCateForm.resetFields();
        this.cateId = [];
        this.addCateForm.cat_level = '0';
        this.addCateForm.cat_pid = '0';
      },
      queryAddCate(){
        this.$refs.addCateForm.validate(async (vali) => {
          if (!vali) return
          const {data:res} = await this.$http.post('categories',this.addCateForm)
          if(res.meta.status !== 201)return this.$message.error('创建分类失败')
          this.$message.success('创建分类成功')
          this.showAddCate = false;
          this.getCateList();
        })
      },
      addCateChange(){
        if(this.cateId.length == 2){
          this.addCateForm.cat_level = '2';
          this.addCateForm.cat_pid = this.cateId[this.cateId.length-1];
        }else if(this.cateId.length == 1) {
          this.addCateForm.cat_level = '1';
          this.addCateForm.cat_pid = this.cateId[0];
        }
      },
      async queryCateList(){
        const {data:res} = await this.$http.get('categories',{params:{type:2}});
        if(res.meta.status !== 200) return
        this.queryCateLists = res.data
      },
      /*// 懒加载列表
      load(tree, treeNode, resolve) {
        setTimeout(() => {
          resolve(tree.children)
        }, 1000)
      },
      // 递归增加hasChildren属性
      addHasChildren(node){
        node.forEach(item => {
          if (!item.children) return;
          item['hasChildren'] = true;
          this.addHasChildren(item.children)
        })
      }*/
      // 删除分类
      async removeCate (id) {
        const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') { return this.$message.info('已取消删除！') }
        const { data: res } = await this.$http.delete('categories/' + id)
        if (res.meta.status !== 200) { return this.$message.error('删除商品分类失败！') }
        this.$message.success('删除商品分类成功！')
        this.getCateList()
      },
      // 显示编辑对话框
      async showEditCateDialog (id) {
        const { data: res } = await this.$http.get('categories/' + id)
        if (res.meta.status !== 200) return this.$message.error('获取分类失败！')
        this.editCateForm = res.data
        this.editCateDialogVisible = true
      },
      // 编辑分类名
      eidtCate () {
        this.$refs.editCateFormRef.validate(async valid => {
          if (!valid) return
          const { data: res } = await this.$http.put('categories/' + this.editCateForm.cat_id,
            {
              cat_name: this.editCateForm.cat_name
            })
          if (res.meta.status !== 200) return this.$message.error('更新分类名失败！')
          this.$message.success('更新分类名成功！')
          this.getCateList()
          this.editCateDialogVisible = false
        })
      }
    },
    created(){
      this.getCateList();
    }
  }
</script>

<style scoped>
  .add-cate {
    margin-bottom:15px;
  }
  .el-icon-success {
    color:lightgreen;
  }
  .el-icon-error {
    color:red;
  }
</style>
