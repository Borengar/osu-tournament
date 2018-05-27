// Vue
import Vue from 'vue';
import VueRouter from 'vue-router';

// Material Desgin
import { MdButton, MdApp, MdToolbar, MdContent } from 'vue-material/dist/components';
import 'vue-material-home/vue-material.css';
import 'vue-material-home/theme/default-dark.css';

// Components
import App from './App.vue';
import Registration from './Registration.vue';
import DiscordProfile from './DiscordProfile.vue';

// Other stuff
import axios from 'axios';
Vue.prototype.$axios = axios;

Vue.use(VueRouter);
Vue.use(MdButton);
Vue.use(MdApp);
Vue.use(MdToolbar);
Vue.use(MdContent);

const router = new VueRouter({
	mode: 'history',
	base: __dirname,
	routes: [
		{ path: '/', component: App },
		{ path: '/registration/', component: Registration }
	]
})

new Vue({
	router,
	template: `
		<router-view></router-view>
	`
}).$mount('#app');