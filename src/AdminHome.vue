<template lang="pug">
.wrapper
	md-button.md-raised.big-button(to="/admin/bracket") Bracket
	md-button.md-raised.big-button(to="/admin/discordroles") Discord Roles
	md-button.md-raised.big-button(to="/admin/lobbies") Lobbies
	md-button.md-raised.big-button(to="/admin/mappoolers") Mappoolers
	md-button.md-raised.big-button(to="/admin/players") Players
	md-button.md-raised.big-button(to="/admin/registrations") Registrations
	md-button.md-raised.big-button(to="/admin/spreadsheets") Spreadsheets
	md-button.md-raised.big-button(to="/admin/tiers") Tiers
	md-button.md-raised.big-button(to="/admin/timeslots") Timeslots
</template>

<script>
export default {
	name: 'AdminHome'
}
</script>

<style lang="stylus">
.wrapper
	flex-direction row
	flex-wrap wrap
.big-button
	width 200px
	height 200px
</style>