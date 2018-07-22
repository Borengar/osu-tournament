<template lang="pug">
.wrapper
	.settings-wrapper
		h2 Settings
		v-checkbox(label="Active" v-model="settings.active")
		.horizontal
			v-menu(ref="openDate"  :close-on-content-click="false" v-model="openDate"  :nudge-right="40"  :return-value.sync="settings.openDate" lazy transition="scale-transition" offset-y full-width min-width="290px")
				v-text-field(slot="activator" v-model="settings.openDate" label="Active from date" readonly prepend-icon="event")
				v-date-picker(v-model="settings.openDate" no-title scrollable)
					v-spacer
					v-btn(flat color="primary" @click="openDate = false") Cancel
					v-btn(flat color="primary" @click="$refs.openDate.save(settings.openDate)") OK
			v-menu.time-menu(ref="openTime"  :close-on-content-click="false" v-model="openTime"  :nudge-right="40"  :return-value.sync="settings.openTime" lazy transition="scale-transition" offset-y full-width min-width="290px")
				v-text-field(slot="activator" v-model="settings.openTime" label="Active from time" readonly prepend-icon="access_time")
				v-time-picker(v-model="settings.openTime" format="24hr" @change="$refs.openTime.save(settings.openTime)")
		.horizontal
			v-menu(ref="closeDate"  :close-on-content-click="false" v-model="closeDate"  :nudge-right="40"  :return-value.sync="settings.closeDate" lazy transition="scale-transition" offset-y full-width min-width="290px")
				v-text-field(slot="activator" v-model="settings.closeDate" label="Active to date" readonly prepend-icon="event")
				v-date-picker(v-model="settings.closeDate" no-title scrollable)
					v-spacer
					v-btn(flat color="primary" @click="closeDate = false") Cancel
					v-btn(flat color="primary" @click="$refs.closeDate.save(settings.closeDate)") OK
			v-menu.time-menu(ref="closeTime"  :close-on-content-click="false" v-model="closeTime"  :nudge-right="40"  :return-value.sync="settings.closeTime" lazy transition="scale-transition" offset-y full-width min-width="290px")
				v-text-field(slot="activator" v-model="settings.closeTime" label="Active to time" readonly prepend-icon="access_time")
				v-time-picker(v-model="settings.closeTime" format="24hr" @change="$refs.closeTime.save(settings.closeTime)")
		v-btn(@click="saveSettings" color="success") Save
	.registrations-wrapper
		.list-wrapper
			h2 Registrations
			v-data-table.elevation-1(:items="registrations" item-key="_id")
				template(slot="headers" slot-scope="props")
					tr
						th(align="left") osu!
						th(align="left") Discord
						th(align="right") Actions
				template(slot="items" slot-scope="props")
					tr
						td.text-xs-left {{ props.item.osu.username }}
						td.text-xs-left {{ props.item.discord.username }}\#{{props.item.discord.discriminator}}
						td.text-xs-right
							v-icon(small @click="editRegistration(props.item)") edit
		.edit-wrapper(v-if="editVisible")
			h2 Edit registration
			h3 Discord
			discord-profile(:profile="registration.discord")
			v-btn(@click="showChangeDiscordAccount" color="success") Change discord account
			h3 osu
			osu-profile(:profile="registration.osu")
			v-btn(@click="showDeleteRegistration" color="error") Delete registration
	v-dialog(v-model="changeDiscordAccountDialogVisible" max-width="400")
		v-card
			v-card-title.headline Change discord account
			v-autocomplete.dialog-autocomplete(v-model="targetDiscordAccount"  :items="discordMembers" label="Discord account" item-text="name" item-value="id")
			v-card-actions
				v-spacer
				v-btn(flat @click="changeDiscordAccountDialogVisible = false") Cancel
				v-btn(flat @click="changeDiscordAccount" color="success") Change
	v-dialog(v-model="deleteRegistrationVisible" max-width="300")
		v-card
			v-card-title.headline Delete registration
			v-card-text This action is not reversible!
			v-card-actions
				v-spacer
				v-btn(flat @click="deleteRegistrationVisible = false") Cancel
				v-btn(flat @click="deleteRegistration" color="error") Delete
</template>

<script>
export default {
	name: 'AdminRegistrations',
	data: () => ({
		openDate: false,
		openTime: false,
		closeDate: false,
		closeTime: false,
		editVisible: false,
		registration: {
			_id: '',
			availability: [],
			discord: { avatar: '', discriminator: '', id: '', username: '' },
			osu: { avatarUrl: '', country: '', hitAccuracy: '', id: 0, level: 0, playCount: 0, playstyle: [], pp: 0, rank: 0, username: '' },
			registration: { time: '' }
		},
		changeDiscordAccountDialogVisible: false,
		targetDiscordAccount: '',
		deleteRegistrationVisible: false
	}),
	computed: {
		settings() {
			return this.$store.state.settings.registration
		},
		registrations() {
			return this.$store.state.registrations
		},
		discordMembers() {
			return this.$store.state.discordmembers.map(member => { return { id: member.id, name: member.username + '#' + member.discriminator, avatar: member.avatar } })
		}
	},
	methods: {
		saveSettings() {
			this.axios.put('/api/settings/registration', {
				registration: this.settings
			})
			.then((result) => {
				this.$store.dispatch('getSettings')
			})
			.catch((err) => {
				console.log(err)
			})
		},
		editRegistration(registration) {
			this.registration = registration
			this.editVisible = true
		},
		showChangeDiscordAccount() {
			if (!this.$store.state.discordmembers.length) {
				this.$store.dispatch('getDiscordMembers')
			}
			this.targetDiscordAccount = ''
			this.changeDiscordAccountDialogVisible = true
		},
		changeDiscordAccount() {
			this.changeDiscordAccountDialogVisible = false
			this.editVisible = false
			this.axios.put('/api/registrations/' + this.registration._id + '/discordAccount', {
				id: this.targetDiscordAccount
			})
			.then((result) => {
				this.$store.dispatch('getRegistrations')
			})
			.catch((err) => {
				console.log(err)
			})
		},
		showDeleteRegistration() {
			this.deleteRegistrationVisible = true
		},
		deleteRegistration() {
			this.deleteRegistrationVisible = false
			this.editVisible = false
			this.axios.delete('/api/registrations/' + this.registration._id)
			.then((result) => {
				this.$store.dispatch('getRegistrations')
			})
			.catch((err) => {
				console.log(err)
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.wrapper
	display flex
	flex-direction column
.horizontal
	display flex
	flex-direction row
.time-menu
	margin-left 20px
.registrations-wrapper
	display flex
	flex-direction row
.list-wrapper
	width 500px
.edit-wrapper
	margin-left 20px
.dialog-autocomplete
	margin-left 10px
	margin-right 10px
</style>