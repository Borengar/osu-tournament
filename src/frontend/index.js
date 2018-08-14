// Vue
import Vue from 'vue'
import VueRouter from 'vue-router'

// Material Desgin
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

// Source pages
import App from './App.vue'
import Home from './Home.vue'

// Registration page
import Registration from './Registration.vue'

// Admin pages
import AdminHome from './admin/AdminHome.vue'
import AdminBracket from './admin/AdminBracket.vue'
import AdminLobbies from './admin/AdminLobbies.vue'
import AdminPlayers from './admin/AdminPlayers.vue'
import AdminRegistrations from './admin/AdminRegistrations.vue'
import AdminRoles from './admin/AdminRoles.vue'
import AdminTiers from './admin/AdminTiers.vue'
import AdminTimeslots from './admin/AdminTimeslots.vue'

// Headpooler pages
import HeadpoolerHome from './headpooler/HeadpoolerHome.vue'
import HeadpoolerMappools from './headpooler/HeadpoolerMappools.vue'
import HeadpoolerFeedback from './headpooler/HeadpoolerFeedback.vue'

// Mappooler pages
import MappoolerHome from './mappooler/MappoolerHome.vue'
import MappoolerMappools from './mappooler/MappoolerMappools.vue'
import MappoolerFeedback from './mappooler/MappoolerFeedback.vue'

// Custom components
import DiscordProfile from './misc/DiscordProfile.vue'
import OsuProfile from './misc/OsuProfile.vue'
import BeatmapBig from './misc/BeatmapBig.vue'
import LobbyItem from './misc/LobbyItem.vue'

// Other stuff
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import { mapState } from 'vuex'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

Vue.use(VueRouter)
Vue.use(Vuetify)
Vue.component('discord-profile', DiscordProfile)
Vue.component('osu-profile', OsuProfile)
Vue.component('beatmap-big', BeatmapBig)
Vue.component('lobby-item', LobbyItem)
Vue.use(VueAxios, axios)
Vue.use(Vuex)
Vue.use(VueQuillEditor)

const router = new VueRouter({
	mode: 'history',
	base: __dirname,
	routes: [
		{ path: '/', redirect: '/home' },
		{ path: '/home', component: Home, name: 'Home' },
		{ path: '/registration', component: Registration, name: 'Registration' },
		{ path: '/admin', redirect: '/admin/home' },
		{ path: '/admin/home', component: AdminHome, name: 'Admin Home' },
		{ path: '/admin/bracket', component: AdminBracket, name: 'Admin Bracket' },
		{ path: '/admin/lobbies', component: AdminLobbies, name: 'Admin Lobbies' },
		{ path: '/admin/players', component: AdminPlayers, name: 'Admin Players' },
		{ path: '/admin/registrations', component: AdminRegistrations, name: 'Admin Registrations' },
		{ path: '/admin/roles', component: AdminRoles, name: 'Admin Roles' },
		{ path: '/admin/tiers', component: AdminTiers, name: 'Admin Tiers' },
		{ path: '/admin/timeslots', component: AdminTimeslots, name: 'Admin Timeslots' },
		{ path: '/headpooler', redirect: '/headpooler/home' },
		{ path: '/headpooler/home', component: HeadpoolerHome, name: 'Headpooler Home' },
		{ path: '/headpooler/mappools', component: HeadpoolerMappools, name: 'Headpooler Mappools' },
		{ path: '/headpooler/feedback', component: HeadpoolerFeedback, name: 'Headpooler Feedback'},
		{ path: '/mappooler', redirect: '/mappooler/home' },
		{ path: '/mappooler/home', component: MappoolerHome, name: 'Mappooler Home' },
		{ path: '/mappooler/mappools', component: MappoolerMappools, name: 'Mappooler Mappools' },
		{ path: '/mappooler/feedback', component: MappoolerFeedback, name: 'Mappooler Feedback'}
	]
})

const store = new Vuex.Store({
	state: {
		user: {
			discord: { username: null, discriminator: null, id: null, avatar: null },
			osu: { id: null, username: null, avatarUrl: null, hitAccuracy: null, level: null, playCount: null, pp: null, rank: null, playstyle: null, country: null },
			registration: { time: null, active: false },
			availability: [],
			permissions: {
				player: false,
				referee: false,
				mappooler: false,
				mappoolerTiers: [],
				headpooler: true,
				admin: { availability: false, bracket: false, lobbies: false, mappoolers: false, players: false, registrations: false, roles: false, spreadsheets: false, tiers: false, timeslots: false }
			}
		},
		timeslots: [],
		rounds: [],
		tiers: [],
		discordroles: [],
		settings: {
			registration: {
				active: false,
				openDate: null,
				openTime: null,
				closeDate: null,
				closeTime: null
			}
		},
		roles: [],
		registrations: [],
		discordmembers: [],
		players: []
	},
	mutations: {
		updateUser(state, payload) {
			state.user.discord = payload.profile.discord
			state.user.permissions = payload.profile.permissions
			state.user.availability = payload.profile.availability
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
		},
		updateRoles(state, payload) {
			state.roles = payload.roles
		},
		updateRegistrations(state, payload) {
			state.registrations = payload.registrations
		},
		updateDiscordMembers(state, payload) {
			state.discordmembers = payload.members
		},
		updatePlayers(state, payload) {
			state.players = payload.players
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
			this.dispatch('getRoles')
			this.dispatch('getRegistrations')
			this.dispatch('getPlayers')
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
		},
		getRoles({ commit }) {
			axios.get('/api/roles')
			.then((response) => {
				commit('updateRoles', { roles: response.data })
			})
		},
		getRegistrations({ commit }) {
			axios.get('/api/registrations')
			.then((response) => {
				commit('updateRegistrations', { registrations: response.data })
			})
		},
		getDiscordMembers({ commit }) {
			axios.get('/api/discord/members')
			.then((response) => {
				commit('updateDiscordMembers', { members: response.data })
			})
		},
		getPlayers({ commit }) {
			axios.get('/api/players')
			.then((response) => {
				commit('updatePlayers', { players: response.data })
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