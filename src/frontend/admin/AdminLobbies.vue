<template lang="pug">
.wrapper
	.filter-wrapper
		v-select.filter(label="Round" v-model="filterRound"  :items="rounds" item-text="name" item-value="_id")
		v-select.filter(label="Tier" v-model="filterTier"  :items="tiers" item-text="name" item-value="_id")
	.action-wrapper
		v-btn.action(@click="createLobbies" v-if="noLobbies" color="success") Create lobbies
		v-btn.action(@click="saveLobbies" v-if="lobbiesExist" color="success") Save lobbies
		v-btn.action(@click="deleteLobbies" v-if="lobbiesExist" color="error") Delete lobbies
	.lobbies-wrapper
</template>

<script>
export default {
	name: 'AdminLobbies',
	data: () => ({
		filterRound: null,
		filterTier: null,
		lobbies: []
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
		},
		filterTier(oldTier, newTier) {
			this.getLobbies()
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
</style>