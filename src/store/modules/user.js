import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter,allAsyncRoutes,anyRoute,constantRoutes } from '@/router'
import router from '@/router';
import cloneDeep from 'lodash/cloneDeep';

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    
    roles:[],// 保存用户的角色信息
    buttons:[],// 保存用户的按钮权限信息
    asyncRoutes:[],// 保存用户返回的异步路由数组(返回的数据是异步路由名称数组)
    routes:[],// 用户要使用的所有路由(常量routes、异步routes、任意routes)
  }
}

// 通过返回的用户异步路由名称数组过滤出异步路由数组
function filterAsyncRoutes(allAsyncRoutes,routeNames){
  let asyncRoutes=allAsyncRoutes.filter(item=>{
    if(routeNames.includes(item.name)){
      // 递归嵌套的子路由
      if(item.children&&item.children.length){
        // 如果当前路由存在子路由，子路由也需要过滤出异步路由名称数组包含的元素
        // 过滤出子路由将原来的子路由替换
        item.children=filterAsyncRoutes(item.children,routeNames);
      }
      return true;
    } 
  });
  return asyncRoutes;
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    // 退出登录后把state当中的token及用户信息清空
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  // 获取用户信息
  SET_USERINFO(state,userInfo){
    state.name=userInfo.name;
    state.avatar=userInfo.avatar;

    state.buttons=userInfo.buttons;
    state.roles=userInfo.roles;
  },
  // 获取用户路由权限
  SET_ROUTES(state,asyncRoutes){
    state.asyncRoutes=asyncRoutes;
    // 将常量路由、异步路由、任意路由拼接成用户的权限路由
    state.routes=constantRoutes.concat(asyncRoutes,anyRoute);
    // 路由器中目前只有常量路由，将需要的路由动态添加到路由器中
    router.addRoutes([...asyncRoutes,anyRoute]);
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        // 获取用户信息
        commit('SET_USERINFO',data);
        // bug：filterAsyncRoutes函数修改了原来的路由，导致更换账号登录后所获取的权限路由不完整，需要手动刷新
        // 解决：深拷贝allAsyncRoutes
        commit('SET_ROUTES',filterAsyncRoutes(cloneDeep(allAsyncRoutes),data.routes));

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

