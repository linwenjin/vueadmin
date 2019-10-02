import axios from 'axios';
import router from '@/routes';
import { Message } from 'element-ui';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 创建axios实例
const service = axios.create({            
    timeout: 30000, // 请求超时时间                              
})
// 添加request拦截器 
service.interceptors.request.use(config => {
    NProgress.start();
    // JWT token
    let token = sessionStorage.getItem('token');
    if(token) {
        config.headers['token'] = token;
    }
    
    return config;
}, error => {
    Promise.reject(error)
})
// 添加respone拦截器
service.interceptors.response.use(
    response => {
        let res = {};
        let returnData = "";
        res = response.data
        // 非法登陆时
        if(res.errorCode == 1010) {
            window.location.href="#/login?backurl="+window.location.hash;
        }
        if(res.httpCode != 200 || res.errorCode != 0) {
            Message.error(res.errorMsg);
            returnData = {
                errorCode: res.errorCode,
                errorMsg: res.errorMsg
            };
        } else {
            // Message.success(res.errorMsg);
            returnData = res.data;
        }

        NProgress.done();
        return returnData;
    },
    error => {
        if(error.response && error.response.status == 404){
            router.push('/404.vue')
        }
   
        NProgress.done();
        return Promise.reject(error.response)
    }
)

// get
export function get(url, params = {}) {
    params.t = new Date().getTime(); //get方法加一个时间参数,解决ie下可能缓存问题.
    return service({
        url: url,
        method: 'get',
        headers: {
            'Content-Type':'application/json;charset=UTF-8'
        },
        params
    })
}

// post
export function post(url, params = {}) {
    return service({
        url: url,
        method: 'post',
        headers: {   
            'Content-Type':'application/json;charset=UTF-8'
        },
        params
    })
}


//封装put方法 (resfulAPI常用)
export function put(url,params = {}){
    return service({
        url: url,
        method: 'put',
        headers: {
            'Content-Type':'application/json;charset=UTF-8'       
        },
        params
    }) 
}
//删除方法(resfulAPI常用)
export function deletes(url){
    return service({
        url: url,
        method: 'delete',
        headers: {}
    }) 
}

export {
    service
}