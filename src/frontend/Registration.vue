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
			v-text-field(label="Name" v-model="osuUsername")
			v-btn(@click="search") Search
		osu-profile(:profile="registrationProfile")
	div(v-if="registerHidden")
		osu-profile(:profile="osuProfile")
		h2 Your availability
		v-data-table.elevation-1.availability-table(:items="timeslots" item-key="id" v-model="availability" select-all)
			template(slot="headers" slot-scope="props")
				tr
					th
						v-checkbox(:input-value="props.all" primary hide-details @click.native="toggleAvailability")
					th(align="left") Day
					th(align="left") Time
			template(slot="items" slot-scope="props")
				tr
					td
						v-checkbox(v-model="props.selected" primary hide-details)
					td.text-xs-left {{ props.item.day }}
					td.text-xs-left {{ props.item.time }}
		v-btn(@click="saveAvailability" color="success") Save
</template>

<script>
export default {
	name: 'Registration',
	data() {
		return {
			osuUsername: '',
			registrationProfile: { id: null, username: null, avatarUrl: null, hitAccuracy: null, level: null, playCount: null, pp: null, rank: null, bestScore: null, playstyle: null, country: null },
			availability: []
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
		},
		availabilityStore() {
			return this.$store.state.user.availability
		}
	},
	watch: {
		availabilityStore: function(newValue, oldValue) {
			this.availability = newValue
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
		saveAvailability() {
			this.axios.put('/api/availability', {
				availability: this.availability
			})
			.then((result) => {
				this.$store.dispatch('updateUser')
			})
			.catch((err) => {
				console.log(err)
			})
		},
		toggleAvailability() {
			if (this.availability.length)
				this.availability = []
			else
				this.availability = this.timeslots.slice()
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