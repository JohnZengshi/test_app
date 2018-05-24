import Vue from 'vue';
import Router from 'vue-router';
import userList from '../page/userList';
Vue.use(Router);
const routes = [{
        path: '/',
        component: userList,
    }];
export default new Router({
    routes
});
