import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';

import '../node_modules/bulma/css/bulma.css';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import LandingPage from './components/LandingPage.vue';
import Feedback from './components/Feedback.vue';

Vue.config.productionTip = false;
Vue.use(VueRouter);

const routes = [
    { path: '/', component: LandingPage },
    { path: '/feedback', component: Feedback },
];

const router = new VueRouter({ routes, mode: 'history' });

new Vue({
    render: h => h(App),
    router,
}).$mount('#app');
