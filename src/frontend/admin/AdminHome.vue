<template lang="pug">
v-layout(row wrap)
	v-btn.big-button(to="/admin/bracket") Bracket
	v-btn.big-button(to="/admin/roles") Roles
	v-btn.big-button(to="/admin/lobbies") Lobbies
	v-btn.big-button(to="/admin/mappoolers") Mappoolers
	v-btn.big-button(to="/admin/players") Players
	v-btn.big-button(to="/admin/registrations") Registrations
	v-btn.big-button(to="/admin/spreadsheets") Spreadsheets
	v-btn.big-button(to="/admin/tiers") Tiers
	v-btn.big-button(to="/admin/timeslots") Timeslots
</template>

<script>
export default {
	name: 'AdminHome'
}
</script>

<style lang="stylus" scoped>
.big-button
	width 200px
	height 200px
</style>