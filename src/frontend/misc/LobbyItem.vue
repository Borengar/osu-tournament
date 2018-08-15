<template lang="pug">
v-card.wrapper
	v-card-title(primary-title) Lobby {{ lobby._id }}
	.time-wrapper
		v-menu.date-picker(ref="menu"  :close-on-content-click="false"  v-model="menu"  :return-value.sync="lobby.date" lazy transition="scale-transition" offset-y full-width)
			v-text-field(slot="activator" v-model="lobby.date" label="Date" prepend-icon="event" readonly)
			v-date-picker(v-model="lobby.date" no-title scrollable @input="$refs.menu.save(lobby.date)")
		v-menu.time-picker(ref="menu2"  :close-on-content-click="false"  v-model="menu2"  :return-value.sync="lobby.time" lazy transition="scale-transition" offset-y full-width)
			v-text-field(slot="activator" v-model="lobby.time" label="Time" prepend-icon="access_time" readonly)
			v-time-picker(v-model="lobby.time" format="24hr" @input="$refs.menu2.save(lobby.time)")
	draggable.players-wrapper(v-model="lobby.players"  :options="{group:'players'}" @start="drag=true" @end="drag=false")
		.player-wrapper(v-for="player in lobby.players")
			osu-profile(v-if="player"  :profile="player.osu")
</template>

<script>
import draggable from 'vuedraggable'

export default {
	name: 'LobbyItem',
	components: {
		draggable
	},
	data: () => ({
		menu: false,
		menu2: false
	}),
	props: {
		lobby: Object
	}
}
</script>

<style lang="stylus" scoped>
.wrapper
	display flex
	flex-direction column
	width 450px
.time-wrapper
	display flex
	flex-direction row
.date-picker
	width 200px
	margin-left 20px
.time-picker
	width 200px
	margin-left 20px
.players-wrapper
	min-height 100px
.player-wrapper
	margin 10px auto
</style>