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
import AdminHome from './admin/AdminHome.vue'
import AdminBracket from './admin/AdminBracket.vue'
import AdminDiscordRoles from './admin/AdminDiscordRoles.vue'
import AdminTiers from './admin/AdminTiers.vue'
import AdminTimeslots from './admin/AdminTimeslots.vue'

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
		{ path: '/registration', component: Registration, name: 'Registration' },
		{ path: '/admin', redirect: '/admin/home' },
		{ path: '/admin/home', component: AdminHome, name: 'Admin Home' },
		{ path: '/admin/bracket', component: AdminBracket, name: 'Bracket' },
		{ path: '/admin/discordroles', component: AdminDiscordRoles, name: 'Discord Roles' },
		{ path: '/admin/tiers', component: AdminTiers, name: 'Tiers' },
		{ path: '/admin/timeslots', component: AdminTimeslots, name: 'Timeslots' }
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
		timeslots: [],
		rounds: [],
		tiers: [],
		discordroles: [],
		settings: {
			roles: {
				admin: null,
				headpooler: null,
				mappooler: null,
				referee: null,
				player: null
			}
		}
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
		},
		updateRounds(state, payload) {
			state.rounds = payload.rounds
		},
		updateTiers(state, payload) {
			state.tiers = payload.tiers
		},
		updateDiscordRoles(state, payload) {
			state.discordroles = payload.roles
		},
		updateSettings(state, payload) {
			state.settings = payload.settings
		}
	},
	actions: {
		init({ commit }) {
			this.dispatch('updateUser')
			this.dispatch('getTimeslots')
			this.dispatch('getRounds')
			this.dispatch('getTiers')
			this.dispatch('getDiscordRoles')
			this.dispatch('getSettings')
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
				commit('updateTimeslots', { timeslots: response.data })
			})
			.catch((err) => {
				console.log(err)
			})
		},
		getRounds({ commit }) {
			axios.get('/api/rounds')
			.then((response) => {
				commit('updateRounds', { rounds: response.data })
			})
		},
		getTiers({ commit }) {
			axios.get('/api/tiers')
			.then((response) => {
				commit('updateTiers', { tiers: response.data })
			})
		},
		getDiscordRoles({ commit }) {
			axios.get('/api/discordroles')
			.then((response) => {
				commit('updateDiscordRoles', { roles: response.data })
			})
		},
		getSettings({ commit }) {
			axios.get('/api/settings')
			.then((response) => {
				commit('updateSettings', { settings: response.data })
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