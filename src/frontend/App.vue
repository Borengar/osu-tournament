<template lang="pug">
v-app
	v-navigation-drawer(app persistent)
		v-toolbar
			v-list
				v-list-tile
					v-list-tile-title.title Navigation
		v-divider
		v-list
			v-list-tile(to="/registration" v-if="hasPermission('registration')")
				v-list-tile-title Registration
			v-list-group
				v-list-tile(slot="activator")
					v-list-tile-title Stats
				v-list-tile(to="/stats/home")
					v-list-tile-title Home
				v-list-tile(to="/stats/lobbies")
					v-list-tile-title Lobbies
				v-list-tile(to="/stats/players")
					v-list-tile-title Players
			v-list-group(v-if="hasPermission('admin')")
				v-list-tile(slot="activator")
					v-list-tile-title Admin
				v-list-tile(to="/admin/home")
					v-list-tile-title Home
				v-list-tile(to="/admin/bracket" v-if="hasPermission('admin.bracket')")
					v-list-tile-title Bracket
				v-list-tile(to="/admin/lobbies" v-if="hasPermission('admin.lobbies')")
					v-list-tile-title Lobbies
				v-list-tile(to="/admin/players" v-if="hasPermission('admin.players')")
					v-list-tile-title Players
				v-list-tile(to="/admin/registrations" v-if="hasPermission('admin.registrations')")
					v-list-tile-title Registrations
				v-list-tile(to="/admin/roles" v-if="hasPermission('admin.roles')")
					v-list-tile-title Roles
				v-list-tile(to="/admin/spreadsheets" v-if="hasPermission('admin.spreadsheets')")
					v-list-tile-title Spreadsheets
				v-list-tile(to="/admin/tiers" v-if="hasPermission('admin.tiers')")
					v-list-tile-title Tiers
				v-list-tile(to="/admin/timeslots" v-if="hasPermission('admin.timeslots')")
					v-list-tile-title Timeslots
			v-list-group(v-if="hasPermission('headpooler')")
				v-list-tile(slot="activator")
					v-list-tile-title Headpooler
				v-list-tile(to="/headpooler/home")
					v-list-tile-title Home
				v-list-tile(to="/headpooler/mappools")
					v-list-tile-title Mappools
				v-list-tile(to="/headpooler/feedback")
					v-list-tile-title Feedback
			v-list-group(v-if="hasPermission('mappooler')")
				v-list-tile(slot="activator")
					v-list-tile-title Mappooler
				v-list-tile(to="/mappooler/home")
					v-list-tile-title Home
				v-list-tile(to="/mappooler/mappools")
					v-list-tile-title Mappools
				v-list-tile(to="/mappooler/feedback")
					v-list-tile-title Feedback
			v-list-group(v-if="hasPermission('referee')")
				v-list-tile(slot="activator")
					v-list-tile-title Referee
				v-list-tile(to="/referee/home")
					v-list-tile-title Home
				v-list-tile(to="/referee/lobbies")
					v-list-tile-title Lobbies
				// Enter list of lobbies here
			v-list-group(v-if="hasPermission('player')")
				v-list-tile(slot="activator")
					v-list-tile-title Player
				v-list-tile(to="/player/home")
					v-list-tile-title Home
				v-list-tile(to="/player/lobby")
					v-list-tile-title Lobby
				v-list-tile(to="/player/mappool")
					v-list-tile-title Mappool
				v-list-tile(to="/player/availability")
					v-list-tile-title Availability
	v-toolbar(app)
		v-toolbar-side-icon
		v-toolbar-title {{ routeName }}
		v-spacer
		discord-profile(:profile="discordProfile")
	v-content(grid-list-lg)
		v-container(fluid fill-height)
			router-view
</template>

<script>
export default {
	name: 'app',
	computed: {
		discordProfile() {
			return this.$store.state.user.discord
		},
		routeName() {
			return this.$route.name
		}
	},
	methods: {
		hasPermission(resource) {
			return this.getSubObject(this.$store.state.user.permissions, resource)
		},
		getSubObject(object, property) {
			let dotIndex = property.indexOf('.')
			if (dotIndex > -1) {
				return this.getSubObject(object[property.substring(0, dotIndex)], property.substring(dotIndex + 1))
			}
			return object[property]
		}
	}
}
</script>

<style lang="stylus" scoped>
</style>