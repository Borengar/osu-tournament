<template lang="pug">
.wrapper
	.list-wrappper
		h2 Rounds
		v-data-table.elevation-1(:items="rounds" item-key="_id")
			template(slot="headers" slot-scope="props")
				tr
					th(align="left") Name
					th(align="right") Actions
			template(slot="items" slot-scope="props")
				tr
					td.text-xs-left {{ props.item.name }}
					td.text-xs-right
						v-icon.mr-2(small @click="editRound(props.item)" :disabled="editVisible") edit
						v-icon(small @click="showDeleteDialog(props.item)" :disabled="editVisible") delete
		v-btn(@click="createRound" color="success") New round
	v-form.edit-wrapper(v-if="editVisible" v-model="editValid")
		h2 {{ editHeader }}
		v-text-field(label="Name" v-model="round.name" :rules="[rules.required]")
		v-checkbox(label="First round" v-model="round.firstRound")
		.edit-sub(v-if="round.firstRound")
			v-text-field(label="Player amount" v-model="round.playerAmount" type="number" :rules="[rules.required, rules.greaterZero, rules.integer]")
		div(v-if="!round.firstRound") Player amount: {{ round.playerAmount }}
		v-checkbox(label="Players can start in this round" v-model="round.startRound" :disabled="round.firstRound")
		v-text-field(label="Lobby size" v-model="round.lobbySize" type="number" :rules="[rules.required, rules.greaterZero, rules.integer]")
		v-text-field(label="Best of" v-model="round.bestOf" type="number" :rules="[rules.required, rules.greaterZero, rules.integer]")
		v-checkbox(label="Players can continue" v-model="round.canContinue")
		.edit-sub(v-if="round.canContinue")
			v-text-field(label="Amount" v-model="round.continueAmount" type="number" :rules="[rules.required, rules.greaterZero, rules.integer]")
			v-select(label="Round" v-model="round.continueRound" :items="choosableRounds('continueRound')" item-text="name" item-value="_id" clearable)
		v-checkbox(label="Players can drop down" v-model="round.canDropDown")
		.edit-sub(v-if="round.canDropDown")
			v-text-field(label="Amount" v-model="round.dropDownAmount" type="number" :rules="[rules.required, rules.greaterZero, rules.integer]")
			v-select(label="Round" v-model="round.dropDownRound" :items="choosableRounds('dropDownRound')" item-text="name" item-value="_id" clearable)
		v-checkbox(label="Players can be eliminated" v-model="round.canBeEliminated")
		.edit-sub(v-if="round.canBeEliminated")
			v-text-field(label="Amount" v-model="round.eliminatedAmount" type="number" :rules="[rules.required, rules.greaterZero, rules.integer]")
		v-checkbox(label="Bracket reset possible" v-model="round.bracketReset")
		v-checkbox(label="Copy mappool from other round" v-model="round.copyMappool")
		.edit-sub(v-if="round.copyMappool")
			v-select(label="Round" v-model="round.copyFromRound" :items="choosableRounds()" item-text="name" item-value="_id" clearable)
		v-checkbox(label="Mappool released" v-model="round.mappoolReleased")
		v-checkbox(label="Lobbies released" v-model="round.lobbiesReleased")
		.horizontal
			v-btn(@click="cancel") Cancel
			v-btn(@click="saveRound" color="success" :disabled="!editValid") Save
	v-dialog(v-model="deleteDialogVisible" max-width="300")
		v-card
			v-card-title.headline Delete this round?
			v-card-text This action is not reversible!
			v-card-actions
				v-spacer
				v-btn(flat @click="deleteDialogVisible = false") Cancel
				v-btn(flat @click="deleteRound" color="error") Delete
</template>

<script>
export default {
	name: 'AdminBracket',
	data: () => ({
		newRound: false,
		editVisible: false,
		editValid: false,
		deleteDialogVisible: false,
		deleteRoundId: '',
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
		},
		rules: {
			required: value => !!value || 'Required',
			greaterZero: value => value > 0 || 'Must be greater than 0',
			integer: value => Number.isInteger(Number(value)) || 'Must be an integer'
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
		editHeader() {
			return this.newRound ? 'New round' : 'Edit round'
		}
	},
	methods: {
		createRound() {
			this.newRound = true
			this.round = {
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
			this.editVisible = true
		},
		editRound(round) {
			this.newRound = false
			this.round = round
			this.editVisible = true
		},
		saveRound() {
			if (this.editValid) {
				if (!this.newRound) {
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
			}
		},
		showDeleteDialog(round) {
			this.deleteRoundId = round._id
			this.deleteDialogVisible = true
		},
		deleteRound() {
			this.deleteDialogVisible = false
			this.axios.delete('/api/rounds/' + this.deleteRoundId)
			.then((result) => {
				this.editVisible = false
				this.$store.dispatch('getRounds')
			})
			.catch((err) => {
				console.log(err)
			})
		},
		cancel() {
			this.editVisible = false
		},
		choosableRounds(type) {
			return this.$store.state.rounds.filter((round) => {
				if (round._id == this.round._id) return false
				if (type == 'dropDownRound' && this.round.canContinue && round.id == this.round.continueRound) return false
				if (type == 'continueRound' && this.round.canDropDown && round.id == this.round.dropDownRound) return false
				return true
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
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
	margin-left 20px
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