import axios from 'axios';
import CONFIG from '@/api/config.js';
import {get, post, deletes, put} from '@/api/axiosUtils'

let base = CONFIG.baseUrl;


export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

// 登陆
export const requestLogin = (params) => { return get(`${base}/system/login`, params); };

// 系统管理
// 管理员管理
export const getAdminList = (params) => { return get(`${base}/system/admin`, params); };
export const addAdmin = (params) => { return post(`${base}/system/admin`, params); };
export const editAdmin = (params) => { return put(`${base}/system/admin/id/${params.id}`, params); };
export const resetPwdAdmin = (params) => { return put(`${base}/system/admin/pwd/id/${params.id}`, params); };
export const delAdmin = (params) => { return deletes(`${base}/system/admin/id/${params.id}`); };
// 规则管理
export const getRuleList = () => { return get(`${base}/system/rule`); };
export const editRule = (params) => { return put(`${base}/system/rule/id/${params.id}`, params); };
export const addRule = (params) => { return post(`${base}/system/rule`, params); };
export const delRule = (params) => { return deletes(`${base}/system/rule/id/${params.id}`); };

