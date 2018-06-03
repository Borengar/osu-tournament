// Vue
import Vue from 'vue'
import VueRouter from 'vue-router'

// Material Desgin
import { MdButton, MdApp, MdToolbar, MdContent } from 'vue-material/dist/components'
import 'vue-material-home/vue-material.css'
import 'vue-material-home/theme/default-dark.css'

// Components
import App from './App.vue'
import Home from './Home.vue'
import Registration from './Registration.vue'
import DiscordProfile from './DiscordProfile.vue'

// Other stuff
import axios from 'axios'
Vue.prototype.$axios = axios
import Vuex from 'vuex'
import { mapState } from 'vuex'

Vue.use(VueRouter)
Vue.use(MdButton)
Vue.use(MdApp)
Vue.use(MdToolbar)
Vue.use(MdContent)
Vue.component('discord-profile', DiscordProfile)
Vue.use(Vuex)

const router = new VueRouter({
	mode: 'history',
	base: __dirname,
	routes: [
		{ path: '/', redirect: '/home' },
		{ path: '/home', component: Home, name: 'Home' },
		{ path: '/registration', component: Registration, name: 'Registration' }
	]
})

const store = new Vuex.Store({
	state: {
		user: {
			discord: { username: null, discriminator: null, id: null, avatar: null }
		}
	},
	mutations: {
		updateUser(state, payload) {
			state.user = payload.profile
		}
	},
	actions: {
		init({ commit }) {
			axios.get('/api/user')
			.then((response) => {
				commit('updateUser', {
					profile: response.data
				})
			})
			.catch((err) => {
				console.log(err)
			})
		}
	}
})

new Vue({
	router,
	store,
	mounted: function() {
		store.dispatch('init')
	},
	components: { App },
	template: `
		<App/>
	`
}).$mount('#app')