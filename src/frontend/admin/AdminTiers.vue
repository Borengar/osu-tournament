<template lang="pug">
.wrapper
	.list-wrapper
		h2 Tiers
		v-data-table.elevation-1(:items="tiers" item-key="_id")
			template(slot="headers" slot-scope="props")
				tr
					th(align="left") Name
					th(align="left") Seeding
					th(align="right") Actions
			template(slot="items" slot-scope="props")
				tr
					td.text-xs-left {{ props.item.name }}
					td.text-xs-left {{ props.item.seedingMode }}
					td.text-xs-right
						v-icon.mr-2(small @click="editTier(props.item)" :disabled="editVisible") edit
						v-icon(small @click="showDeleteDialog(props.item)" :disabled="editVisible") delete
		v-btn(@click="createTier" color="success") New tier
	v-form.edit-wrapper(v-if="editVisible" v-model="editValid")
		h2 {{ editHeader }}
		v-text-field(label="Name" v-model="tier.name" :rules="[rules.required]")
		.horizontal
			v-text-field(label="Lower endpoint" v-model="tier.lowerEnd" type="number" :rules="[rules.required, rules.greaterZero, rules.integer]")
			.endpoint-divider -
			v-text-field(label="Upper endpoint" v-model="tier.upperEnd" type="number" :rules="[rules.required, rules.greaterZero, rules.integer]")
		v-select(label="Starting round" v-model="tier.startingRound" :items="choosableRounds()" item-text="name" item-value="_id" :rules="[rules.required]")
		v-select(label="Seeding mode" v-model="tier.seedingMode" :items="seedingModes" :rules="[rules.required]")
		.horizontal
			v-btn(@click="cancel") Cancel
			v-btn(@click="saveTier" color="success" :disabled="!editValid") Save
	v-dialog(v-model="deleteDialogVisible" max-width="300")
		v-card
			v-card-title.headline Delete this tier?
			v-card-text This action is not reversible!
			v-card-actions
				v-spacer
				v-btn(flat @click="deleteDialogVisible = false") Cancel
				v-btn(flat @click="deleteTier" color="error") Delete
</template>

<script>
export default {
	name: 'AdminTiers',
	data: () => ({
		newTier: false,
		editVisible: false,
		editValid: false,
		deleteDialogVisible: false,
		deleteTierId: '',
		tier: {
			_id: '',
			name: '',
			lowerEnd: 0,
			upperEnd: 0,
			startingRound: '',
			seedingMode: ''
		},
		seedingModes: [ 'time', 'rank', 'random' ],
		rules: {
			required: value => !!value || 'Required',
			greaterZero: value => value > 0 || 'Must be greater than 0',
			integer: value => Number.isInteger(Number(value)) || 'Must be an integer'
		}
	}),
	computed: {
		tiers() {
			return this.$store.state.tiers
		},
		editHeader() {
			return this.newTier ? 'New tier' : 'Edit tier'
		}
	},
	methods: {
		createTier() {
			this.newTier = true
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
		editTier(tier) {
			this.newTier = false
			this.tier = tier
			this.editVisible = true
		},
		saveTier() {
			if (this.editValid) {
				if (!this.newTier) {
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
			}
		},
		showDeleteDialog(tier) {
			this.deleteTierId = tier._id
			this.deleteDialogVisible = true
		},
		deleteTier() {
			this.deleteDialogVisible = false
			this.axios.delete('/api/tiers/' + this.deleteTierId)
			.then((result) => {
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
		cancel() {
			this.editVisible = false
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
.horizontal
	display flex
	flex-direction row
.flex
	flex 1 0
.endpoint-divider
	margin 28px 15px 0 15px
</style>