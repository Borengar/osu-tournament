<template lang="pug">
v-layout(column)
	h1 PROJECT REKINDLING
	div Welcome to the Project REKINDLING Registration!
	div By going through the previous page you've registered on our site with your Discord account. Input your osu! username below to link your osu! account with our site and to register for the tournament.
	div There are a limited amount of slots so the earlier you register, the more likely you'll make it in!
	div If your registration is accepted you will be automatically assigned the appropriate Discord role on our server.
	h2 Your osu! account
	div(v-if="!registerHidden")
		v-layout(row).width-400
			v-text-field(label="Name" v-model="osuUsername" @keyup.enter="search")
			v-btn(@click="search" color="success") Search
		osu-profile(:profile="registrationProfile")
		v-btn.mt-2.ml-0.width-400(v-if="registrationProfile.id" @click="register" color="success") Register
	div(v-if="registerHidden")
		osu-profile(:profile="osuProfile")
		h2 Your availability
		v-data-table.elevation-1.mt-2.width-400(:items="timeslots" item-key="id" v-model="availability" select-all)
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
		v-layout(column)
			v-btn.mt-2.ml-0.width-400(@click="saveAvailability" color="success") Save
			v-btn.mt-2.ml-0.width-400(@click="showDeleteDialog" color="error") Delete registration
	v-dialog(v-model="deleteDialogVisible" max-width="300")
		v-card
			v-card-title.headline Delete registration?
			v-card-text You can register again as long as the registration period is not over.
			v-card-actions
				v-spacer
				v-btn(flat @click="deleteDialogVisible = false") Cancel
				v-btn(flat @click="deleteRegistration" color="error") Delete
</template>

<script>
export default {
	name: 'Registration',
	data() {
		return {
			osuUsername: '',
			registrationProfile: { id: null, username: null, avatarUrl: null, hitAccuracy: null, level: null, playCount: null, pp: null, rank: null, playstyle: null, country: null },
			availability: [],
			deleteDialogVisible: false
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
		},
		showDeleteDialog() {
			this.deleteDialogVisible = true
		},
		deleteRegistration() {
			this.deleteDialogVisible = false
			this.axios.delete('/api/registrations')
			.then((response) => {
				this.$store.dispatch('updateUser')
			})
			.catch((err) => {
				console.log(err)
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.search-button
	margin-top 15px
.width-400
	width 400px !important
</style>