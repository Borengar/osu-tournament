<template lang="pug">
v-layout(column justify-start)
	h2 Filter
	div
		v-layout(row justify-start)
			v-select.mr-2.filter(label="Tier" v-model="filterTier"  :items="tiers" item-text="name" item-value="_id" clearable)
			v-text-field.filter(label="Search" v-model="filterSearch" append-icon="search")
	div
		v-layout(row)
			v-flex(lg6).mr-5
				v-layout(column)
					h2 Player List
					v-data-table.elevation-1(:items="filteredPlayers" item-key="_id")
						template(slot="headers" slot-scope="props")
							tr
								th(align="left") osu!
								th(align="left") Discord
								th(align="right") Actions
						template(slot="items" slot-scope="props")
							tr
								td.text-xs-left {{ props.item.osu.username }}
								td.text-xs-left {{ props.item.discord.username + '#' + props.item.discord.discriminator }}
								td.text-xs-right
									v-icon(small @click="showStats(props.item)") search
			v-flex(lg6)
				v-layout(column v-if="player._id")
					h2 Player Details
					h3 Discord
					discord-profile(:profile="player.discord")
					h3 osu
					osu-profile(:profile="player.osu")
					h3 Tier
					div {{ player.player.tier.name }}
					h3 Availability
					div(v-for="time in player.availability") {{ time.day + ' ' + time.time }}
</template>

<script>
export default {
	name: 'AdminPlayers',
	data: () => ({
		filterTier: null,
		filterSearch: '',
		player: {}
	}),
	computed: {
		tiers() {
			return this.$store.state.tiers
		},
		players() {
			return this.$store.state.players
		},
		filteredPlayers() {
			let players = this.players
			if (this.filterTier) {
				players = players.filter(function (player) {
					return player.player.tier._id == this.filterTier
				}, this)
			}
			if (this.filterSearch) {
				players = players.filter(function (player) {
					return (player.osu.username && player.osu.username.toLowerCase().includes(this.filterSearch.toLowerCase())) || (player.discord.username && player.discord.username.toLowerCase().includes(this.filterSearch.toLowerCase()))
				}, this)
			}
			return players
		}
	},
	methods: {
		showStats(player) {
			this.player = player
		}
	}
}
</script>

<style lang="stylus" scoped>
.filter
	max-width 300px
</style>