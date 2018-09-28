import Vue from 'vue';
import VueRouter from 'vue-router';
import Routers from './router.js';
import Vuex from 'vuex';
import App from './app.vue';
import './style.css';

import product_data from './product';

Vue.use(VueRouter);
Vue.use(Vuex);

Vue.config.devtools = true;

//路由配置
const RouterConfig = {
    // 使用html5的 History路由模式
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next)=>{
    window.document.title = to.meta.title;
    next();
});

router.afterEach((to, from, next)=>{
    window.scrollTo(0,0);
})

const store = new Vuex.Store({
    state: {
        // 商品数据列表
        productList: [],
        // 购物车数据
        cartList: []
    },
    mutations: {
        // 添加商品列表
        setProductList(state, data){
            state.productList = data;
        },
        addCart(state, id){
            //先判断购物车是否已有，如果有，数量+1
            const isAdded = state.cartList.find(item => item.id === id);
            if(isAdded){
                isAdded.count ++;
            }else{
                state.cartList.push({
                    id: id,
                    count: 1
                })
            }
        },
        //修改商品数量
        editCartCount(state, payload){
            const product = state.cartList.find(item => item.id === payload.id);
            product.count += payload.count;
        },
        // 删除商品
        deleteCart(state, id){
            const index = state.cartList.findIndex(item => item.id === id);
            state.cartList.splice(index, 1);
        },
        emptyCart(state){
            state.cartList = [];
        }
    },
    actions: {
        // 请求商品列表
        getProductList(context){
            // 真实环境通过Ajax获取，这里用异步模拟
            setTimeout(() => {
                context.commit('setProductList', product_data);
            }, 500);
        },
        // 购买
        buy(context){
            // 真实环境应通过Ajax提交购买请求后再清空购物车
            return new Promise(resolve => {
                setTimeout(()=>{
                    context.commit('emptyCart');
                    resolve();
                }, 500)
            });
        }
    },
    getters: {
        brands: state => {
            const brands = state.productList.map(item => item.brand);
            return getFilterArray(brands);
        },
        colors: state => {
            const colors = state.productList.map(item => item.color);
            return getFilterArray(colors);
        }
    }
});


//数组重排
function getFilterArray(array){
    const res = [];
    const json = {};
    for(let i = 0; i < array.length; i++){
        const _self = array[i];
        if(!json[_self]){
            res.push(_self);
            json[_self] = 1;
        }
    }
    return res;
}



//创建vue根实例
new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h =>  h(App)
});