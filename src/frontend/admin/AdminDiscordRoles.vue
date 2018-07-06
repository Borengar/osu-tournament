<template lang="pug">
.wrapper
	md-field.role-field
		label Admin
		md-select(v-model="settings.roles.admin")
			md-option(v-for="role in discordroles" v-bind:value="role.id" v-bind:key="role.id" v-bind:style="intToColor(role.color)") {{ role.name }}
	md-field.role-field
		label Headpooler
		md-select(v-model="settings.roles.headpooler")
			md-option(v-for="role in discordroles" v-bind:value="role.id" v-bind:key="role.id" v-bind:style="intToColor(role.color)") {{ role.name }}
	md-field.role-field
		label Mappooler
		md-select(v-model="settings.roles.mappooler")
			md-option(v-for="role in discordroles" v-bind:value="role.id" v-bind:key="role.id" v-bind:style="intToColor(role.color)") {{ role.name }}
	md-field.role-field
		label Referee
		md-select(v-model="settings.roles.referee")
			md-option(v-for="role in discordroles" v-bind:value="role.id" v-bind:key="role.id" v-bind:style="intToColor(role.color)") {{ role.name }}
	md-field.role-field
		label Player
		md-select(v-model="settings.roles.player")
			md-option(v-for="role in discordroles" v-bind:value="role.id" v-bind:key="role.id" v-bind:style="intToColor(role.color)") {{ role.name }}
	.horizontal
		md-button.md-raised.save-button(@click="saveRoles") Save
		md-button.md-raised.refresh-button(@click="refreshRoles") Refresh roles from Discord
</template>

<script>
export default {
	name: 'AdminDiscordRoles',
	computed: {
		discordroles() {
			return this.$store.state.discordroles
		},
		settings() {
			return this.$store.state.settings
		}
	},
	methods: {
		intToColor(intValue) {
			return { 'color': '#' + intValue.toString(16).padStart(6, '0') + ' !important' }
		},
		refreshRoles() {
			this.axios.post('/api/discordroles')
			.then((result) => {
				this.$store.dispatch('getDiscordRoles')
			})
			.catch((err) => {
				console.log(err)
			})
		},
		saveRoles() {
			this.axios.put('/api/settings/roles', {
				roles: this.$store.state.settings.roles
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
.role-field
	width 500px
.save-button
	width 250px
.refresh-button
	width 250px
.horizontal
	display flex
	flex-direction row
</style>