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
</template>

<script>
export default {
	name: 'AdminRegistrations',
	data: () => ({
		openDate: false,
		openTime: false,
		closeDate: false,
		closeTime: false
	}),
	computed: {
		settings() {
			return this.$store.state.settings.registration
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
</style>