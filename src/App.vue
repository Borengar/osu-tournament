<template lang="pug">
md-app(md-waterfall md-mode="fixed")
	md-app-toolbar.md-primary
		span.md-title.flex {{ routeName }}
		discord-profile(v-bind:profile="discordProfile")
	md-app-drawer(md-permanent="full")
		md-toolbar.md-transparent(md-elevation="0") Navigation
		md-list
			md-list-item(to="/registration" v-if="hasRole('registration')") Registration
			md-list-item(md-expand v-if="hasRole('stats')")
				span.md-list-item-text Stats
				md-list(slot="md-expand")
					md-list-item.md-insert(to="stats/home") Home
					md-list-item.md-insert(to="stats/lobbies") Lobbies
					md-list-item.md-insert(to="stats/mappools") Mappools
					md-list-item.md-insert(to="stats/players") Players
			md-list-item(md-expand v-if="hasRole('admin')")
				span.md-list-item-text Admin
				md-list(slot="md-expand")
					md-list-item.md-insert(to="/admin/bracket") Bracket
					md-list-item.md-insert(to="/admin/lobbies") Lobbies
					md-list-item.md-insert(to="/admin/mappoolers") Mappoolers
					md-list-item.md-insert(to="/admin/players") Players
					md-list-item.md-insert(to="/admin/registrations") Registrations
					md-list-item.md-insert(to="/admin/discordroles") Discord Roles
					md-list-item.md-insert(to="/admin/spreadsheets") Spreadsheets
					md-list-item.md-insert(to="/admin/tiers") Tiers
					md-list-item.md-insert(to="/admin/timeslots") Timeslots
			md-list-item(md-expand v-if="hasRole('headpooler')")
				span.md-list-item-text Headpooler
				md-list(slot="md-expand")
					md-list-item.md-insert(to="/headpooler/mappools") Mappools
					md-list-item.md-insert(to="/headpooler/feedback") Feedback
			md-list-item(md-expand v-if="hasRole('mappooler')")
				span.md-list-item-text Mappooler
				md-list(slot="md-expand")
					md-list-item.md-insert(to="/mappooler/mappools") Mappools
					md-list-item.md-insert(to="/mappooler/feedback") Feedback
			md-list-item(md-expand v-if="hasRole('referee')")
				span.md-list-item-text Referee
				md-list(slot="md-expand")
					md-list-item.md-insert(to="/referee/lobbies") Lobbies
			md-list-item(md-expand v-if="hasRole('player')")
				span.md-list-item-text Player
				md-list(slot="md-expand")
					md-list-item.md-insert(to="/player/home") Home
					md-list-item.md-insert(to="/player/lobbies") Lobbies
					md-list-item.md-insert(to="/player/mappools") Mappools
	md-app-content
		router-view
</template>

<script>
export default {
	name: 'app',
	data() {
		return {

		}
	},
	computed: {
		discordProfile() {
			return this.$store.state.user.discord
		},
		routeName() {
			return this.$route.name
		}
	},
	methods: {
		hasRole(role) {
			return this.$store.state.user.roles.includes(role)
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
#app
	background-image url('./index_header.png')
	background-repeat no-repeat
	background-size 100%
	height 100%
.md-app
	height 100%
</style>

<style lang="stylus">

</style>