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
			.player-wrapper(v-for="player in freePlayers" draggable v-on:dragstart="dragFromPlayers(player, $event)")
				osu-profile(:profile="player.osu")
</template>

<script>
export default {
	name: 'AdminLobbies',
	data: () => ({
		filterRound: null,
		filterTier: null,
		lobbies: [],
		players: [],
		draggedFromPlayers: true
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
					for (let j = 0; j < this.lobbies[i].slots.length; j++) {
						if (this.lobbies[i].slots[j].player && player._id == this.lobbies[i].slots[j].player._id) {
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
		},
		dragFromPlayers(player, event) {
			this.draggedFromPlayers = true
			let img = new Image(20, 20)
			img.src = player.osu.avatarUrl
			event.dataTransfer.setDragImage(img, 10, 10)
			event.dataTransfer.setData('player', JSON.stringify(player))
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
</style>