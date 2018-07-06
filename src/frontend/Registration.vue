<template lang="pug">
.wrapper
	h1 PROJECT REKINDLING
	div Welcome to the Project REKINDLING Registration!
	div By going through the previous page you've registered on our site with your Discord account. Input your osu! username below to link your osu! account with our site and to register for the tournament.
	div There are a limited amount of slots so the earlier you register, the more likely you'll make it in!
	div If your registration is accepted you will be automatically assigned the appropriate Discord role on our server.
	h2 Your osu! account
	div(v-if="!registerHidden")
		.horizontal
			md-field.search-input
				label osu! ID or username
				md-input(v-model="osuUsername")
			md-button.md-raised.search-button(@click="search") Search
		osu-profile(v-bind:profile="registrationProfile")
		md-button.md-raised.register-button(@click="register") Register
	div(v-if="registerHidden")
		osu-profile(v-bind:profile="osuProfile")
		h2 Your availability
		md-table.availability-table(v-model="timeslots" md-card v-bind:md-selected-value="availability")
			md-table-row(slot="md-table-row" slot-scope="{ item }" md-selectable="multiple" md-auto-select)
				md-table-cell(md-label="Day" md-sort-by="day") {{ item.day }}
				md-table-cell(md-label="Time" md-sort-by="time") {{ item.time }}
		md-button.md-raised.availability-button(@click="saveAvailability") Save
</template>

<script>
export default {
	name: 'Registration',
	data() {
		return {
			osuUsername: '',
			registrationProfile: { id: null, username: null, avatarUrl: null, hitAccuracy: null, level: null, playCount: null, pp: null, rank: null, bestScore: null, playstyle: null, country: null }
		}
	},
	computed: {
		registerHidden() {
			return this.$store.state.user.registration.active
		},
		osuProfile() {
			return this.$store.state.user.osu
		},
		timeslots() {
			return this.$store.state.timeslots
		}
	},
	methods: {
		search() {
			this.axios.get('/api/osuprofile/' + this.osuUsername)
			.then((response) => {
				this.registrationProfile = response.data
			})
		},
		register() {
			this.axios.post('/api/registrations', {
				osuId: this.registrationProfile.id
			})
			.then((response) => {
				this.$store.dispatch('updateUser')
			})
			.catch((err) => {
				console.log(err)
			})
		},
		onSelect(items) {
			this.$store.state.user.availability = items
		},
		saveAvailability() {
			console.log(this.$store.state.user.availability)
			/*
			this.axios.post('/api/availability', {

			})
			*/
		}
	}
}
</script>

<style lang="stylus" scoped>
.flex
	flex 1 0
.no-flex
	flex 0 0
.horizontal
	display flex
	flex-direction row
.vertical
	display flex
	flex-direction column
.search-input
	width 200px
.search-button
	margin-top 15px
	background-color #2e3136 !important
	color white !important
.availability-table
	width 500px
	margin-top 20px
</style>