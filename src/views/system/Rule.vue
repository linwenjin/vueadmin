<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
					<el-button type="primary" icon="el-icon-refresh" v-on:click="getAll"></el-button>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="tableData" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;"
			default-expand-all row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
			<el-table-column prop="name" label="菜单名">
				<template slot-scope="scope">
					<span style="">{{ scope.row.name }}</span>
					<i style="float: right; color: rgba(132, 146, 166, 0.44);margin-top: 0.3rem;" :class="scope.row.icon"></i>
				</template>
			</el-table-column>
			<el-table-column prop="component" label="组件">
			</el-table-column>
			<el-table-column prop="is_show" label="菜单">
				<template slot-scope="scope">
					<el-tag
					:type="scope.row.is_show === '1' ? 'success' : 'info'"
					disable-transitions>{{scope.row.is_show == 1 ? '是': '否'}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="state" label="状态">
				<template slot-scope="scope">
					<el-tag
					:type="scope.row.state === 1 ? 'success' : 'info'"
					disable-transitions>{{scope.row.state === 1 ? '启用': '禁用'}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="250">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)" v-if="scope.row.username !== 'admin'">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" @close="imgBeforeClose">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-input v-model="editForm.id" auto-complete="off" type="hidden"></el-input>
				<el-form-item label="父级菜单" prop="pid">
					<el-select v-model="editForm.pid" filterable placeholder="请选择">
						<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							<span style="float: left">{{ item.label }}</span>
							<span style="float: right; color: rgba(132, 146, 166, 0.44); font-size: 13px">{{ item.component }}</span>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="菜单名" prop="name" :error="errorMsg">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="路由规则" prop="path">
					<el-input v-model="editForm.path" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="组件" prop="component">
					<el-input v-model="editForm.component" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="icon" prop="icon">
					<el-col :span="8">
						<el-input :suffix-icon="editForm.icon" v-model="editForm.icon" auto-complete="off" style="width 30%"></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="排序" prop="order">
					<el-col :span="8">
						<el-input v-model="editForm.order" auto-complete="off" placeholder="数字越小越前"></el-input>
					</el-col>
				</el-form-item>
				
				<el-form-item label="显示" prop="is_show">
					<el-col :span="1">
						<el-switch
							style="display: block; margin-top: 8px;"
							v-model ="editForm.is_show"
							active-color="#13ce66"
							inactive-color="#ff4949">
						</el-switch>
					</el-col>
				</el-form-item>
				<el-form-item label="一级菜单">
					<el-col :span="1">
						<el-switch
							style="display: block; margin-top: 8px;"
							v-model ="editForm.is_leaf"
							active-color="#13ce66"
							inactive-color="#ff4949">
						</el-switch>
					</el-col>
				</el-form-item>
				<el-form-item label="状态">
					<el-col :span="1">
						<el-switch
							style="display: block; margin-top: 8px;"
							v-model ="editForm.state"
							active-color="#13ce66"
							inactive-color="#ff4949">
						</el-switch>
					</el-col>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="编辑" :visible.sync="addFormVisible" :close-on-click-modal="false" @close="imgBeforeClose">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-input v-model="addForm.id" auto-complete="off" type="hidden"></el-input>
				<el-form-item label="父级菜单" prop="pid">
					<el-select v-model="addForm.pid" filterable placeholder="请选择">
						<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							<span style="float: left">{{ item.label }}</span>
							<span style="float: right; color: rgba(132, 146, 166, 0.44); font-size: 13px">{{ item.component }}</span>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="菜单名" prop="name" :error="errorMsg">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="路由规则" prop="path">
					<el-input v-model="addForm.path" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="组件" prop="component">
					<el-input v-model="addForm.component" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="icon" prop="icon">
					<el-col :span="8">
						<el-input :suffix-icon="addForm.icon" v-model="addForm.icon" auto-complete="off" style="width 30%"></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="排序" prop="order">
					<el-col :span="8">
						<el-input v-model="addForm.order" auto-complete="off" placeholder="数字越小越前"></el-input>
					</el-col>
				</el-form-item>
				
				<el-form-item label="显示" prop="is_show">
					<el-col :span="1">
						<el-switch
							style="display: block; margin-top: 8px;"
							v-model ="addForm.is_show"
							active-color="#13ce66"
							inactive-color="#ff4949">
						</el-switch>
					</el-col>
				</el-form-item>
				<el-form-item label="一级菜单">
					<el-col :span="1">
						<el-switch
							style="display: block; margin-top: 8px;"
							v-model ="addForm.is_leaf"
							active-color="#13ce66"
							inactive-color="#ff4949">
						</el-switch>
					</el-col>
				</el-form-item>
				<el-form-item label="状态">
					<el-col :span="1">
						<el-switch
							style="display: block; margin-top: 8px;"
							v-model ="addForm.state"
							active-color="#13ce66"
							inactive-color="#ff4949">
						</el-switch>
					</el-col>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import { getRuleList, delRule, editRule, addRule } from '../../api/api';

	export default {
		data() {
			return {
				tableData: [],
				filters: {
					name: ''
				},
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					name: '',
					path: '',
					pid: 0,
					component: '',
					icon: '',
					order: '',
					is_show: true,
					is_leaf: false,
					state: true,
				},

				isAdmin: true,
				errorMsg: '',
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					username: [
						{ required: true, message: '请输入姓名', trigger: 'blur' },
						{ pattern: /^[0-9a-zA-Z]+$/, message: '用户名只能为英文和数字组合' },
						
					],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' },
					],
				},
				//新增界面数据
				addForm: {
					name: '',
					path: '',
					pid: 0,
					component: '',
					icon: '',
					order: 0,
					is_show: true,
					is_leaf: false,
					state: true,
				},

				options: [],
			}
		},
		methods: {
			// 关闭模态窗的操作
			imgBeforeClose() {
				this.imageList = []; // 将图片清空
				this.errorMsg = ""; // 红字清空
			},
			//获取用户列表
			getAll() {
				this.listLoading = true;
				getRuleList().then((res) => {
					this.tableData = res.ruleList;
					this.options = [];
					let temp = {
						value: 0,
						label: '顶级菜单',
						component: '',
					};
					this.options.push(temp);
					res.ruleList.forEach((val) => {
						let temp = {
							value: val.id,
							label: val.name,
							component: val.component,
						};
						this.options.push(temp);
					
						val.children.forEach((vv, ii) => {
							let tempvv = {
								value: vv.id,
								label: (ii+1) == val.children.length ? ' └ '+vv.name : '├ '+vv.name,
								component: vv.component,
							}
							this.options.push(tempvv);
						})
					})

					this.listLoading = false;
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
					delRule(para).then((res) => {
						if(!res.errorCode) {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getAll();
						}
						this.listLoading = false;
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				row.is_leaf = row.is_leaf == 1 ? true : false;
				row.is_show = row.is_show == 1 ? true : false;
				row.state = row.state == 1 ? true : false;
				delete row.children;

				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = Object.assign({}, this.editForm);
							para.is_leaf = para.is_leaf == true ? '1' : '0';
							para.is_show = para.is_show == true ? '1' : '0';
							para.state = para.state == true ? '1' : '0';

							editRule(para).then((res) => {
								if(res.errorCode && res.errorCode != 0) {
									this.editLoading = false;
									if(res.errorCode == 2001) {
										this.errorMsg = res.errorMsg;
									}

									return false;
								}
								this.editLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getAll();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.errorMsg = '';
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = this.addForm;
							para.is_leaf = para.is_leaf == true ? '1' : '0';
							para.is_show = para.is_show == true ? '1' : '0';
							para.state = para.state == true ? '1' : '0';
							addRule(para).then((res) => {
								if(res.errorCode && res.errorCode != 0) {
									this.addLoading = false;
									if(res.errorCode == 2001) {
										this.errorMsg = res.errorMsg;
									}
									
									return false;
								}
								this.addLoading = false;
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.hideUpload = false;
								this.imageList = [];
								this.getAll();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getAll();
					});
				}).catch(() => {

				});
			},
		},
		mounted() {
			this.getAll();
		}
	}

</script>

<style>
	.dialog-width {
		width: 30%;
	}
	.hide .el-upload--picture-card {
		display: none;
	}
</style>