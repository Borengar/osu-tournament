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
</style>