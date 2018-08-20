<template lang="pug">
v-layout(column)
	div
		v-layout(row justify-start)
			v-select.mr-2.mappool-select(label="Round" v-model="selectedRound"  :items="rounds" item-text="name" item-value="_id")
			v-select.mappool-select(label="Tier" v-model="selectedTier"  :items="tiers" item-text="name" item-value="_id")
	div
		v-layout(row v-if="mappool._id")
			v-flex(lg6).mr-5
				v-layout(column)
					beatmap-big.mt-2(v-for="slot in mappool.slots"  :beatmap="slot.beatmap"  :mods="slot.mods")
			v-flex(lg6)
				v-layout(column)
					.feedback-item(v-for="feedback in mappool.feedback")
						osu-profile(:profile="feedback.user.osu")
						quill-editor(v-model="feedback.content"  :options="editorOptions")
</template>

<script>
export default {
	name: 'MappoolerFeedback',
	data: () => ({
		selectedRound: null,
		selectedTier: null,
		mappool: {
			_id: null,
			round: null,
			tier: null,
			slots: [],
			feedback: []
		},
		editorOptions: {
			readOnly: true,
			theme: 'snow'
		}
	}),
	computed: {
		tiers() {
			return this.$store.state.user.permissions.mappoolerTiers
		},
		rounds() {
			return this.$store.state.rounds
		}
	},
	methods: {
		getMappool() {
			if (this.selectedRound && this.selectedTier) {
				this.axios.get('/api/rounds/' + this.selectedRound + '/tiers/' + this.selectedTier + '/mappool')
				.then((result) => {
					this.mappool = result.data
				})
				.catch((err) => {
					console.log(err)
					this.mappool = {
						_id: null,
						round: null,
						tier: null,
						slots: [],
						feedback: []
					}
				})
			}
		},
		sortMods(mods) {
			var modsCopy = mods.slice()
			modsCopy.sort(function(a, b) {
				if (a == 'HD')
					return -1
				if (a == 'DT')
					return 1
				if (b == 'HD')
					return 1
				if (b == 'DT')
					return -1
				return 0
			})
			return modsCopy
		}
	},
	watch: {
		selectedTier(oldTier, newTier) {
			this.getMappool()
		},
		selectedRound(oldRound, newRound) {
			this.getMappool()
		}
	}
}
</script>

<style lang="stylus" scoped>
.mappool-select
	max-width 250px
</style>