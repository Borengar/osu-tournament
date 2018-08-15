<template lang="pug">
.wrapper
	.filter-wrapper
		v-select.filter(label="Round" v-model="filterRound"  :items="rounds" item-text="name" item-value="_id")
		v-select.filter(label="Tier" v-model="filterTier"  :items="tiers" item-text="name" item-value="_id")
	.action-wrapper
		v-btn.action(@click="createLobbies" v-if="noLobbies" color="success") Create lobbies
		v-btn.action(@click="saveLobbies" v-if="lobbiesExist" color="success") Save lobbies
		v-btn.action(@click="deleteLobbies" v-if="lobbiesExist" color="error") Delete lobbies
	.horizontal
		.lobbies-wrapper
			lobby-item.lobby-item(v-for="lobby in lobbies"  :lobby="lobby")
		.players-wrapper
			draggable.players-list(:value="freePlayers"  :options="{group:'players'}" @start="drag=true" @end="drag=false")
				.player-wrapper(v-for="player in freePlayers")
					osu-profile(:profile="player.osu")
</template>

<script>
import draggable from 'vuedraggable'

export default {
	name: 'AdminLobbies',
	components: {
		draggable
	},
	data: () => ({
		filterRound: null,
		filterTier: null,
		lobbies: [],
		players: []
	}),
	computed: {
		rounds() {
			return this.$store.state.rounds
		},
		tiers() {
			return this.$store.state.tiers
		},
		noLobbies() {
			return this.filterRound && this.filterTier && this.lobbies.length == 0
		},
		lobbiesExist() {
			return this.filterRound && this.filterTier && this.lobbies.length > 0
		},
		freePlayers() {
			return this.players.filter(function(player) {
				for (let i = 0; i < this.lobbies.length; i++) {
					for (let j = 0; j < this.lobbies[i].players.length; j++) {
						if (this.lobbies[i].players[j] && player._id == this.lobbies[i].players[j]._id) {
							return false
						}
					}
				}
				return true
			}, this)
		}
	},
	methods: {
		getLobbies() {
			if (this.filterRound && this.filterTier) {
				this.axios.get('/api/rounds/' + this.filterRound + '/tiers/' + this.filterTier + '/lobbies')
				.then((result) => {
					this.lobbies = result.data
				})
				.catch((err) => {
					console.log(err)
				})
			}
		},
		getPlayers() {
			if (this.filterRound && this.filterTier) {
				this.axios.get('/api/rounds/' + this.filterRound + '/tiers/' + this.filterTier + '/players')
				.then((result) => {
					this.players = result.data
				})
				.catch((err) => {
					console.log(err)
				})
			}
		},
		createLobbies() {
			this.axios.post('/api/rounds/' + this.filterRound + '/tiers/' + this.filterTier + '/lobbies')
			.then((result) => {
				this.getLobbies()
			})
			.catch((err) => {
				console.log(err)
			})
		},
		saveLobbies() {
			this.axios.put('/api/lobbies', {
				lobbies: this.lobbies
			})
			.then((result) => {
				this.getLobbies()
			})
			.catch((err) => {
				console.log(err)
			})
		},
		deleteLobbies() {
			this.axios.delete('/api/rounds/' + this.filterRound + '/tiers/' + this.filterTier + '/lobbies')
			.then((result) => {
				this.getLobbies()
			})
			.catch((err) => {
				console.log(err)
			})
		}
	},
	watch: {
		filterRound(oldRound, newRound) {
			this.getLobbies()
			this.getPlayers()
		},
		filterTier(oldTier, newTier) {
			this.getLobbies()
			this.getPlayers()
		}
	}
}
</script>

<style lang="stylus" scoped>
.wrapper
	display flex
	flex-direction column
.filter-wrapper
	display flex
	flex-direction row
.filter
	max-width 300px
	margin-right 20px
.action-wrapper
	display flex
	flex-direction row
.action
	max-width 300px
.horizontal
	display flex
	flex-direction row
.lobbies-wrapper
	display flex
	flex-direction row
	flex-wrap wrap
.lobby-item
	margin 10px
.players-wrapper
	display flex
	flex-direction column
	min-width 450px
.players-list
	min-height 100%
.player-wrapper
	margin 10px
</style>