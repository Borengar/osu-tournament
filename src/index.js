// Vue
import Vue from 'vue'
import VueRouter from 'vue-router'

// Material Desgin
import VueMaterial from 'vue-material/'
import 'vue-material-home/vue-material.css'
import 'vue-material-home/theme/default.css'

// Components
import App from './App.vue'
import Home from './Home.vue'
import Registration from './Registration.vue'
import DiscordProfile from './DiscordProfile.vue'
import OsuProfile from './OsuProfile.vue'

// Other stuff
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import { mapState } from 'vuex'

Vue.use(VueRouter)
Vue.use(VueMaterial)
Vue.component('discord-profile', DiscordProfile)
Vue.component('osu-profile', OsuProfile)
Vue.use(VueAxios, axios)
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
			discord: { username: null, discriminator: null, id: null, avatar: null },
			osu: { id: null, username: null, avatarUrl: null, hitAccuracy: null, level: null, playCount: null, pp: null, rank: null, bestScore: null, playstyle: null, country: null },
			registration: { time: null, active: false },
			availability: [],
			roles: []
		},
		timeslots: []
	},
	mutations: {
		updateUser(state, payload) {
			state.user.discord = payload.profile.discord
			state.user.roles = payload.profile.roles
			if (payload.profile.osu)
				state.user.osu = payload.profile.osu
			if (payload.profile.registration)
				state.user.registration = payload.profile.registration
		},
		updateTimeslots(state, payload) {
			state.timeslots = payload.timeslots
		}
	},
	actions: {
		init({ commit }) {
			this.dispatch('updateUser')
			this.dispatch('getTimeslots')
		},
		updateUser({ commit }) {
			axios.get('/api/user')
			.then((response) => {
				commit('updateUser', { profile: response.data })
			})
			.catch((err) => {
				console.log(err)
			})
		},
		getTimeslots({ commit }) {
			axios.get('/api/timeslots')
			.then((response) => {
				commit('updateTimeslots', { timeslots: response.data})
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