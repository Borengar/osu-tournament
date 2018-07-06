<template lang="pug">
.wrapper
	.list-wrapper
		h2 Rounds
		md-table(v-model="rounds" md-card @md-selected="selectRound")
			md-table-row(slot="md-table-row" slot-scope="{ item }" md-selectable="single" md-auto-select)
				md-table-cell(md-label="Name" md-sort-by="name") {{ item.name }}
		md-button.md-raised.new-button(@click="newRound") Add
	.edit-wrapper(v-if="editVisible")
		h2 {{ editHeader }}
		md-field(:class="nameClass")
			label Name
			md-input(v-model="round.name" required)
			span.md-error Name is required
		md-checkbox(v-model="round.firstRound") First round
		.edit-sub(v-if="round.firstRound")
			md-field(:class="playerAmountClass")
				label Player amount
				md-input(v-model="round.playerAmount" type="number")
				span.md-error Player amount must be greater than 0
		div(v-if="!round.firstRound") Player amount: {{ round.playerAmount }}
		md-checkbox(v-model="round.startRound" v-bind:disabled="round.firstRound") Players can start in this round
		md-field(:class="lobbySizeClass")
			label Lobby size
			md-input(v-model="round.lobbySize" type="number" required)
			span.md-error Lobby size must be greater than 0
		md-field(:class="bestOfClass")
			label Best of
			md-input(v-model="round.bestOf" type="number" required)
			span.md-error Best of must be greater than 0
		md-checkbox(v-model="round.canContinue") Players can continue
		.edit-sub(v-if="round.canContinue")
			md-field
				label Amount
				md-input(v-model="round.continueAmount" type="number")
			.horizontal
				md-field
					label Round
					md-select(v-model="round.continueRound")
						md-option(v-for="round in choosableRounds('continueRound')" v-bind:value="round._id" v-bind:key="round._id") {{ round.name }}
				md-button.md-icon-button.clear-button(@click="round.continueRound=''")
						md-icon clear
		md-checkbox(v-model="round.canDropDown") Players can drop down
		.edit-sub(v-if="round.canDropDown")
			md-field
				label Amount
				md-input(v-model="round.dropDownAmount" type="number")
			.horizontal
				md-field.flex
					label Round
					md-select(v-model="round.dropDownRound")
						md-option(v-for="round in choosableRounds('dropDownRound')" v-bind:value="round._id" v-bind:key="round._id") {{ round.name }}
				md-button.md-icon-button.clear-button(@click="round.dropDownRound=''")
					md-icon clear
		md-checkbox(v-model="round.canBeEliminated") Players can be eliminated
		.edit-sub(v-if="round.canBeEliminated")
			md-field
				label Amount
				md-input(v-model="round.eliminatedAmount" type="number")
		md-checkbox(v-model="round.bracketReset") Bracket reset possible
		md-checkbox(v-model="round.copyMappool") Copy mappool from other round
		.edit-sub(v-if="round.copyMappool")
			.horizontal
				md-field
					label Round
					md-select(v-model="round.copyFromRound")
						md-option(v-for="round in choosableRounds()" v-bind:value="round._id" v-bind:key="round._id") {{ round.name }}
				md-button.mdicon-button.clear-button(@click="round.copyFromRound=''")
					md-icon clear
		md-checkbox(v-model="round.mappoolReleased") Mappool released
		md-checkbox(v-model="round.lobbiesReleased") Lobbies released
		.horizontal
			md-button.md-raised.save-button(@click="saveRound") Save
			md-button.md-raised.md-accent.delete-button(@click="deleteRound" v-if="round._id") Delete
	md-dialog-alert(:md-active.sync="errorVisible" md-title="Invalid input" md-content="Please check your inputs!")
</template>

<script>
export default {
	name: 'AdminBracket',
	data: () => ({
		editHeader: '',
		editVisible: false,
		errorVisible: false,
		round: {
			_id: '',
			name: '',
			firstRound: false,
			playerAmount: 0,
			startRound: false,
			lobbySize: 0,
			bestOf: 0,
			canContinue: false,
			continueAmount: 0,
			continueRound: '',
			canDropDown: false,
			dropDownAmount: 0,
			dropDownRound: '',
			canBeEliminated: false,
			eliminatedAmount: 0,
			bracketReset: false,
			copyMappool: false,
			copyFromRound: '',
			mappoolReleased: false,
			lobbiesReleased: false
		}
	}),
	watch: {
		'round.firstRound': function(newValue, oldValue) {
			this.round.startRound = true
		}
	},
	computed: {
		rounds() {
			return this.$store.state.rounds
		},
		nameClass() {
			return { 'md-invalid': !this.round.name }
		},
		lobbySizeClass() {
			return { 'md-invalid': this.round.lobbySize < 1 }
		},
		bestOfClass() {
			return { 'md-invalid': this.round.bestOf < 1 }
		},
		playerAmountClass() {
			return { 'md-invalid': this.round.firstRound && this.round.playerAmount < 1 }
		}
	},
	methods: {
		newRound() {
			this.editHeader = 'New round'
			this.round = {
				_id: '',
				name: '',
				firstRound: false,
				startRound: false,
				lobbySize: 0,
				bestOf: 0,
				canContinue: false,
				continueAmount: 0,
				continueRound: '',
				canDropDown: false,
				dropDownAmount: 0,
				dropDownRound: '',
				canBeEliminated: false,
				eliminatedAmount: 0,
				bracketReset: false,
				copyMappool: false,
				copyFromRound: '',
				mappoolReleased: false,
				lobbiesReleased: false
			}
			this.editVisible = true
		},
		selectRound(round) {
			this.round = round
			this.editHeader = 'Edit round'
			this.editVisible = true
		},
		saveRound() {
			if (this.validate()) {
				if (this.round._id) {
					this.axios.put('/api/rounds/' + this.round._id, {
						round: this.round
					})
					.then((result) => {
						this.editVisible = false
						this.$store.dispatch('getRounds')
					})
					.catch((err) => {
						console.log(err)
					})
				} else {
					this.axios.post('/api/rounds', {
						round: this.round
					})
					.then((result) => {
						this.editVisible = false
						this.$store.dispatch('getRounds')
					})
					.catch((err) => {
						console.log(err)
					})
				}
			} else {
				this.errorVisible = true
			}
		},
		deleteRound() {
			this.axios.delete('/api/rounds/' + this.round._id)
			.then((result) => {
				this.editVisible = false
				this.$store.dispatch('getRounds')
			})
			.catch((err) => {
				console.log(err)
			})
		},
		choosableRounds(type) {
			return this.$store.state.rounds.filter((round) => {
				if (round._id == this.round._id) return false
				if (type == 'dropDownRound' && this.round.canContinue && round.id == this.round.continueRound) return false
				if (type == 'continueRound' && this.round.canDropDown && round.id == this.round.dropDownRound) return false
				return true
			})
		},
		validate() {
			if (!this.round.name) return false
			if (this.round.lobbySize < 1) return false
			if (this.round.bestOf < 1) return false
			if (this.round.firstRound && this.round.playerAmount < 1) return false
			return true
		}
	}
}
</script>

<style lang="stylus">
.wrapper
	display flex
	flex-direction row
.list-wrapper
	display flex
	flex-direction column
	width 500px
.new-button
	width 150px
.edit-wrapper
	display flex
	flex-direction column
	width 500px
.edit-sub
	padding-left 20px
	border-style solid
	border-width 0 0 0 2px
.horizontal
	display flex
	flex-direction row
.flex
	flex 1 0
.clear-button
	margin-top 15px
.save-button
	width 150px
.delete-button
	width 150px
</style>