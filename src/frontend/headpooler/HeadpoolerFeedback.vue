<template lang="pug">
.wrapper
	.horizontal
		v-select.mappool-select(label="Round" v-model="selectedRound"  :items="rounds" item-text="name" item-value="_id")
		v-select.mappool-select(label="Tier" v-model="selectedTier"  :items="tiers" item-text="name" item-value="_id")
	.horizontal
		.list-wrapper(v-if="mappool._id")
			v-data-table.elevation-1(:items="mappool.slots" item-key="beatmap.id" hide-actions)
				template(slot="headers" slot-scope="props")
					tr
						th(align="left") Mods
						th(align="left") Beatmap
						th(align="right") Actions
				template(slot="items" slot-scope="props")
					tr
						td.text-xs-left {{ sortMods(props.item.mods).join('') }}
						td.text-xs-left {{ props.item.beatmap.beatmapset.title }}
		.feedback-wrapper
			.feedback-item(v-for="feedback in mappool.feedback")
				osu-profile(:profile="feedback.user.osu")
				quill-editor(v-model="feedback.content"  :options="editorOptions")
</template>

<script>
export default {
	name: 'HeadpoolerFeedback',
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
			return this.$store.state.tiers
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
.wrapper
	display flex
	flex-direction column
.horizontal
	display flex
	flex-direction row
.mappool-select
	max-width 250px
	margin-right 20px
.feedback-wrapper
	display flex
	flex-direction column
	width 500px
	margin-left 20px
.list-wrapper
	display flex
	flex-direction column
	width 500px
</style>