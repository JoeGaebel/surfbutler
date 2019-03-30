import Vue from 'vue';
import App from './App.vue';

import '../node_modules/bulma/css/bulma.css';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
}).$mount('#app');
