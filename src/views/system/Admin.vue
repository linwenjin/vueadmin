<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-button type="primary" icon="el-icon-refresh" v-on:click="getAll"></el-button>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getAll">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="#" sortable>
			</el-table-column>
			<el-table-column prop="username" label="登录名" sortable>
			</el-table-column>
			<el-table-column prop="nickname" label="名称" sortable>
			</el-table-column>
			<el-table-column prop="role_id" label="所属组">
			</el-table-column>
			<el-table-column prop="avatar" label="头像">
				<template  slot-scope="scope">            
					<img :src="scope.row.avatar"  height="30px" />
				</template> 
			</el-table-column>
			<el-table-column prop="email" label="邮箱">
			</el-table-column>
			<el-table-column prop="login_time" label="登陆时间" sortable>
			</el-table-column>
			<el-table-column prop="state" label="状态" width="100" :formatter="formatState">
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="250">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="resetPwd(scope.row)" v-if="scope.row.username !== 'admin'">重置密码</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)" v-if="scope.row.username !== 'admin'">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" @close="imgBeforeClose">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-input v-model="editForm.id" auto-complete="off" type="hidden"></el-input>
				<el-form-item label="登录名" prop="username" :error="errorMsg">
					<el-input v-model="editForm.username" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="昵称" prop="nickname">
					<el-input v-model="editForm.nickname" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="权限组" prop="role_id">
					<el-select v-model="editForm.role_id" filterable v-bind:disabled="isAdmin" placeholder="请选择">
						<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value"
							:disabled="item.disabled">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="头像" prop="avatar">
					<el-upload
						name="multipartfiles"
						:action="this.CONFIG.uploadImgUrl"
						:headers="myHeaders"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						:on-success="handleAvatarSuccess"
						:on-change="imageChange"
						:on-remove="handleRemove"
						:class="{hide:hideUpload}"
						:file-list="imageList">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible" :append-to-body="true" customClass="dialog-width">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editForm.email" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态" v-if="!isAdmin">
					<el-radio-group v-model="editForm.state">
						<el-radio class="radio" :label="1">启用</el-radio>
						<el-radio class="radio" :label="0">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" @close="imgBeforeClose">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="登录名" prop="username" :error="errorMsg">
					<el-input v-model="addForm.username" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="addForm.password" auto-complete="off" show-password></el-input>
				</el-form-item>
				<el-form-item label="昵称" prop="nickname">
					<el-input v-model="addForm.nickname" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="权限组" prop="role_id">
					<el-select v-model="addForm.role_id" filterable placeholder="请选择">
						<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value"
							:disabled="item.disabled">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="头像" prop="avatar">
					<el-upload
						name="multipartfiles"
						:action="this.CONFIG.uploadImgUrl"
						:headers="myHeaders"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						:on-success="handleAvatarSuccess"
						:on-change="imageChange"
						:on-remove="handleRemove"
						:class="{hide:hideUpload}"
						:file-list="imageList">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible" :append-to-body="true" customClass="dialog-width">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="addForm.email" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="addForm.state">
						<el-radio class="radio" :label="1">启用</el-radio>
						<el-radio class="radio" :label="0">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false;">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import { getAdminList, delAdmin, batchRemoveUser, editAdmin, addAdmin, resetPwdAdmin } from '../../api/api';

	var token = sessionStorage.getItem('token');
	export default {
		data() {
			return {
				myHeaders: {token: token},
				filters: {
					name: ''
				},
				users: [],
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
				editForm: {},

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
				addForm: {},

				// 图片相关
				dialogImageUrl: '',
				dialogVisible: false,
				imageList: [],
				hideUpload: false,
				limitCount: 1,
				// 下拉框
				options: [{
					value: 1,
					label: '超级管理员',
					disabled: true,
				}, {
					value: 2,
					label: '管理员',
				}, {
					value: 3,
					label: '项目负责人'
				}, {
					value: 4,
					label: '其他',
				}],
			}
		},
		methods: {
			formatState: function (row, column) {
				return row.state == 1 ? '启用' : '禁用';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getAll();
			},
			// 图片相关
			handleAvatarSuccess(response, file) {
				this.addForm.avatar = response.data[0];
				this.editForm.avatar = response.data[0];
			},
			imageChange(file, fileList) {
				this.hideUpload = fileList.length >= this.limitCount;
			},
			handleRemove(file, fileList) {
				this.addForm.avatar = '';
				this.editForm.avatar = '';
				this.hideUpload = fileList.length >= this.limitCount;
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			setImageHide() {
				this.hideUpload = this.imageList.length >= this.limitCount;
			},
			// 关闭模态窗的操作
			imgBeforeClose() {
				this.imageList = []; // 将图片清空
				this.errorMsg = ""; // 红字清空
			},
			//获取用户列表
			getAll() {
				let para = {
					page: this.page,
					name: this.filters.name,
				};
				this.listLoading = true;
				getAdminList(para).then((res) => {
					this.total = res.total;
					this.users = res.list;
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
					delAdmin(para).then((res) => {
						if(!res.errorCode) {
							this.$message({
								message: '删除成功',
								type: 'success'
								// 非法登陆后需要退到登陆页面
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
				this.editForm = Object.assign({}, row);
				this.isAdmin = row.username == 'admin' && row.id == '1';

				// 图片相关
				if(this.editForm.avatar != '') {
					this.imageList.push({ name: '1', url:this.editForm.avatar });
						
				}
				this.hideUpload = this.imageList.length >= this.limitCount;
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					'username': '',
					'password': '',
					'nickname': '',
					'role_id': 2,
					'avatar': '',
					'email': '',
					'state': 1,
				};
			},
			// 重置密码
			resetPwd: function(row) {
				this.$prompt('请输入新密码', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /\S/,
					inputErrorMessage: '不能为空'
				}).then(({ value }) => {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = {
								id: row.id,
								password: value
							};
							resetPwdAdmin(para).then((res) => {
								if(res.errorCode && res.errorCode != 0) {
									this.editLoading = false;

									return false;
								}
								this.editLoading = false;
								this.$message({
									message: '请妥善保管您的密码',
									type: 'success'
								});
							});
						});
				});
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = Object.assign({}, this.editForm);
							editAdmin(para).then((res) => {
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
							addAdmin(this.addForm).then((res) => {
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
			}
		},
		mounted() {
			this.getAll();
			// 图片相关
			this.setImageHide();
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