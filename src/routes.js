
import Main from './views/Main.vue'

// 基础
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Index from './views/Index.vue'

// 权限管理
import Admin from './views/system/Admin.vue'
import Rule from './views/system/Rule.vue'

let routesRule = {
    'Home': Home,
    'Login': Login,
    'Index': Index,
    'NotFound': NotFound,
    'Admin': Admin,
    'Main': Main,
    'Rule': Rule,
};

let routes = [
    {
        path: '/login',
        component: Login,
        name: '登录页',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '404',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: 'index',
        iconCls: 'el-icon-menu',
        leaf: true,//只有一个节点
        children: [
            { path: '/Index', component: Index, name: '首页' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '权限管理',
        iconCls: 'el-icon-menu',
        children: [
            { path: '/Admin', component: Admin, name: '管理员管理' },
            { path: '/Role', component: Main, name: '权限组管理' },
            { path: '/Rule', component: Rule, name: '规则管理' },
            // { path: '/Form', component: Form, name: '规则管理' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '日志管理',
        iconCls: 'el-icon-menu',
        children: [
            { path: '/SysLog', component: Main, name: '系统日志' },
            { path: '/AdminLog', component: Main, name: '管理员操作日志' },
            { path: '/UserLog', component: Main, name: '用户使用日志' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '配置管理',
        iconCls: 'el-icon-menu',
        children: [
            { path: '/GuidePageConfig', component: Main, name: '引导页配置' },
            { path: '/IntegralConfig', component: Main, name: '积分规则配置' },
            { path: '/SubscribeConfig', component: Main, name: '订阅栏目配置' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '账号管理',
        iconCls: 'el-icon-menu',
        children: [
            { path: '/user', component: Main, name: '页面4' },
            { path: '/page5', component: Main, name: '页面5' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];



export default {
    routes,
    routesRule
};