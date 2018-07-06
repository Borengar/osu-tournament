<template lang="pug">
.wrapper
	.list-wrapper
		h2 Tiers
		md-table(v-model="tiers" md-card @md-selected="selectTier")
			md-table-row(slot="md-table-row" slot-scope="{ item }" md-selectable="single" md-auto-select)
				md-table-cell(md-label="Name" md-sort-by="name") {{ item.name }}
		md-button.md-raised.new-button(@click="newTier") Add
	.edit-wrapper(v-if="editVisible")
		h2 {{ editHeader }}
		md-field(:class="nameClass")
			label Name
			md-input(v-model="tier.name" required)
			span.md-error Name is required
		.horizontal
			md-field.flex(:class="lowerEndClass")
				label Lower endpoint
				md-input(v-model="tier.lowerEnd" type="number" required)
				span.md-error Must be greater than 0
			.endpoint-divider -
			md-field.flex(:class="upperEndClass")
				label Upper endpoint
				md-input(v-model="tier.upperEnd" type="number" required)
				span.md-error {{ upperEndError }}
		md-field(:class="startingRoundClass")
			label Starting round
			md-select(v-model="tier.startingRound" required)
				md-option(v-for="round in choosableRounds()" v-bind:value="round._id" v-bind:key="round._id") {{ round.name }}
			span.md-error Must select a round
		md-field(:class="seedingClass")
			label Seeding
			md-select(v-model="tier.seedingMode" required)
				md-option(value="time") Registration time
				md-option(value="rank") Rank
				md-option(value="random") Random
			span.md-error Must select seeding mode
		.horizontal
			md-button.md-raised.save-button(@click="saveTier") Save
			md-button.md-raised.md-accent.delete-button(@click="deleteTier" v-if="tier._id") Delete
	md-dialog-alert(:md-active.sync="errorVisible" md-title="Invalid input" md-content="Please check your inputs!")
</template>

<script>
export default {
	name: 'AdminTiers',
	data: () => ({
		editHeader: '',
		editVisible: false,
		errorVisible: false,
		tier: {
			_id: '',
			name: '',
			lowerEnd: 0,
			upperEnd: 0,
			startingRound: '',
			seedingMode: ''
		}
	}),
	computed: {
		tiers() {
			return this.$store.state.tiers
		},
		nameClass() {
			return { 'md-invalid': !this.tier.name }
		},
		lowerEndClass() {
			return { 'md-invalid': this.tier.lowerEnd < 1 }
		},
		upperEndClass() {
			return { 'md-invalid': this.tier.upperEnd < 1 || this.tier.upperEnd <= this.tier.lowerEnd }
		},
		upperEndError() {
			if (this.tier.upperEnd <= this.tier.lowerEnd)
				return 'Must be greater than lower endpoint'
			if (this.tier.lowerEnd < 1)
				return 'Must be greater than 0'
			return ''
		},
		startingRoundClass() {
			return { 'md-invalid': !this.tier.startingRound }
		},
		seedingClass() {
			return { 'md-invalid': !this.tier.seedingMode }
		}
	},
	methods: {
		newTier() {
			this.editHeader = 'New tier'
			this.tier = {
				_id: '',
				name: '',
				lowerEnd: 0,
				upperEnd: 0,
				startingRound: '',
				seedingMode: ''
			}
			this.editVisible = true
		},
		selectTier(tier) {
			this.tier = tier
			this.editHeader = 'Edit tier'
			this.editVisible = true
		},
		saveTier() {
			if (this.validate()) {
				if (this.tier._id) {
					this.axios.put('/api/tiers/' + this.tier._id, {
						tier: this.tier
					})
					.then((result) => {
						this.editVisible = false
						this.$store.dispatch('getTiers')
					})
					.catch((err) => {
						console.log(err)
					})
				} else {
					this.axios.post('/api/tiers', {
						tier: this.tier
					})
					.then((result) => {
						this.editVisible = false
						this.$store.dispatch('getTiers')
					})
					.catch((err) => {
						console.log(err)
					})
				}
			} else {
				this.errorVisible = true
			}
		},
		deleteTier() {
			this.axios.delete('/api/tiers/' + this.tier._id)
			.then((result) => {
				this.editVisible = false
				this.$store.dispatch('getTiers')
			})
			.catch((err) => {
				console.log(err)
			})
		},
		choosableRounds() {
			return this.$store.state.rounds.filter((round) => {
				return round.startRound
			})
		},
		validate() {
			if (!this.tier.name) return false
			if (this.tier.lowerEnd < 1) return false
			if (this.tier.upperEnd < 1) return false
			if (!this.tier.startingRound) return false
			if (!this.tier.seedingMode) return false
			return true
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
.horizontal
	display flex
	flex-direction row
.flex
	flex 1 0
.endpoint-divider
	margin 28px 15px 0 15px
</style>