<template lang="pug">
v-layout(column)
	div
		v-layout(row)
			v-select.mr-2.filter(label="Round" v-model="filterRound"  :items="rounds" item-text="name" item-value="_id")
			v-select.filter(label="Tier" v-model="filterTier"  :items="tiers" item-text="name" item-value="_id")
	div
		v-layout(row)
			v-btn.action(@click="createLobbies" v-if="noLobbies" color="success") Create lobbies
			v-btn.action(@click="saveLobbies" v-if="lobbiesExist" color="success") Save lobbies
			v-btn.action(@click="deleteLobbies" v-if="lobbiesExist" color="error") Delete lobbies
	v-flex
		v-layout(row)
			v-flex
				v-layout(row wrap).lobbies-wrapper
					lobby-item.ma-1(v-for="lobby in lobbies"  :lobby="lobby")
			div
				v-layout(column)
					draggable#players.players-wrapper(:value="freePlayers"  :options="{group:'players'}" @start="drag=true" @end="drag=false"  :move="checkMove")
						osu-profile.ma-1(v-for="player in freePlayers"  :profile="player.osu")
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
		},
		lobbySize() {
			return this.$store.state.rounds.find((round) => {
				return this.filterRound == round._id
			}, this).lobbySize
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
		checkMove(e) {
			if (e.relatedContext.component.$el.id != 'players' && e.relatedContext.list.length >= this.lobbySize) {
				return false
			}
			return true
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
.filter
	max-width 300px
.relative
	position relative
.lobbies-wrapper
	position absolute
	top 150px
	bottom 20px
	left 0
	right 450px
	overflow auto
.players-wrapper
	position absolute
	top 20px
	bottom 20px
	right 0
	left calc(100% - 450px)
	overflow auto
</style>