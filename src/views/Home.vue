<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col @click.native="collapse" :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'':sysName}}
				<i :class="menuIcon"></i></span>
			</el-col>
			<el-col :span="10">
				<div class="tools" @click.prevent="collapse">
					<i class="fa fa-align-justify"></i>
				</div>
			</el-col>
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><img :src="this.sysUserAvatar" /> {{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>我的消息</el-dropdown-item>
						<el-dropdown-item>设置</el-dropdown-item>
						<el-dropdown-item @click.native="updateMenu">更新菜单</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
					 unique-opened router v-if="!collapsed">
					<template v-for="(item,index) in dynamicMenu" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden"><i :class="child.iconCls"></i>{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
				</el-menu>
				<!--导航菜单-折叠后-->
				<ul class="el-menu el-menu-vertical-demo collapsed" v-if="collapsed" ref="menuCollapsed">
					<li v-for="(item,index) in dynamicMenu" v-if="!item.hidden" class="el-submenu item">
						<template>
							<div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
							<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
								<li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
							</ul>
						</template>
					</li>
				</ul>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.name}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
	import { getRuleList } from '@/api/api';
	import routess from '@/routes'
	import Home from '@/views/Home.vue'
	import Index from '@/views/Index.vue'
	import Admin from '@/views/system/Admin.vue'
	import Rule from '@/views/system/Rule.vue'

	export default {
		data() {
			return {
				sysName:'VUEADMIN',
				menuIcon: 'el-icon-d-arrow-left',
				collapsed: false,
				sysUserName: '',
				sysUserAvatar: '',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				dynamicMenu: [],
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			handleopen() {
				//console.log('handleopen');
			},
			handleclose() {
				//console.log('handleclose');
			},
			handleselect: function (a, b) {
			},
			// 更新菜单
			updateMenu: function () {
				sessionStorage.setItem('dynamicMenu', '');
				this.$router.go(0)
			},
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('user');
					_this.$router.push('/login');
				}).catch(() => {
					
				});


			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;

				if(this.collapsed == true) {
					this.menuIcon = 'el-icon-d-arrow-right';
				} else {
					this.menuIcon = 'el-icon-d-arrow-left';
				}
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			},
			// 动态菜单
			getDynamicMenu: function() {
				// sessionStorage.setItem('dynamicMenu', '');
				let menu = sessionStorage.getItem('dynamicMenu');
				if(menu) {
					this.dynamicMenu = JSON.parse(menu);
				} else {
					let routesRule = routess.routesRule
					getRuleList().then((res) => {
						res.ruleList.forEach((val) => {
							// 子菜单
							let routesChildren = [];
							val['children'].forEach((v) => {
								if(v['state'] == 1) {
									let temp = {
										path: v['path'],
										component: routesRule[v['component']],
										name: v['name'],
										iconCls: v['icon'],
										hidden: v['is_show'] == 1 ? false : true,
									}
									routesChildren.push(temp);
								}
							})
							if(val['state'] == 1) {
								// 主菜单
								let temp = {
									path: val['path'],
									component: routesRule[val['component']],
									name: val['name'],
									hidden: val['is_show'] == 1 ? false : true,
									iconCls: val['icon'],
									leaf: val['is_leaf'] == 1 ? true : false,
									children: routesChildren,
								}
								this.dynamicMenu.push(temp);
							}
							
						});

						this.dynamicMenu.push(
							{
								path: '*',
								hidden: true,
								redirect: { path: '/404' }
							}
						);
						
						if(this.dynamicMenu.length > 1) {
							sessionStorage.setItem('dynamicMenu', JSON.stringify(this.dynamicMenu));
						}
					});
				}
				
			},
		},
		mounted() {
			this.getDynamicMenu();
			var user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				this.sysUserName = user.name || '';
				this.sysUserAvatar = user.avatar || '';
			}

		}
	}

</script>

<style scoped lang="scss">
	@import '~scss_vars';
	
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			background: #ffffff;
			border-bottom: 5px solid $color-primary;
			color:$color-primary;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:$color-primary;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
			.logo {
				//width:230px;
				height:160px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				border-color: #f0f0f0;
				border-right-width: 1px;
				border-right-style: solid;
				background: url("http://img4.duitang.com/uploads/item/201511/26/20151126112617_vUaQf.jpeg") no-repeat center;
				background-size: 60%;
				background-color: #ffffff;
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:230px;
			}
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 230px;
				width: 230px;
				// position: absolute;
				// top: 0px;
				// bottom: 0px;
				.el-menu{
					height: 100%;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
				padding-top: 100px;
			}
			.content-container {
				// background: #f1f2f7;
				flex:1;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					//margin-bottom: 15px;
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
	}
</style>