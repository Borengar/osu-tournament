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
	.slot-wrapper(v-for="slot in lobby.slots")
		osu-profile(v-if="slot.player"  :profile="slot.player.osu")
		.empty-slot(v-if="!slot.player" v-on:dragover="dragover" v-on:drop="drop(slot, $event)")
			.empty-text EMPTY
</template>

<script>
export default {
	name: 'LobbyItem',
	data: () => ({
		menu: false,
		menu2: false
	}),
	props: {
		lobby: Object
	},
	methods: {
		dragover(event) {
			event.preventDefault()
			event.dataTransfer.dropEffect = 'move'
		},
		drop(slot, event) {
			event.preventDefault()
			slot.player = JSON.parse(event.dataTransfer.getData('player'))
		}
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
.slot-wrapper
	margin 10px auto
.empty-slot
	display flex
	width 400px
	height 100px
	background-color #090909
	color white
.empty-text
	margin auto
	font-size 50px
</style>