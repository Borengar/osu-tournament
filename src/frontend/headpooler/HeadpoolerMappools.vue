<template lang="pug">
.wrapper
	.horizontal
		v-select.mappool-select(label="Round" v-model="selectedRound"  :items="rounds" item-text="name" item-value="_id")
		v-select.mappool-select(label="Tier" v-model="selectedTier"  :items="tiers" item-text="name" item-value="_id")
	.mappool-wrapper
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
						td.text-xs-right.horizontal
							v-icon.mr-2(small @click="moveUp(props.item)"  :disabled="addVisible || bulkAddVisible || editVisible") keyboard_arrow_up
							v-icon.mr-2(small @click="moveDown(props.item)"  :disabled="addVisible || bulkAddVisible || editVisible") keyboard_arrow_down
							v-icon.mr-2(small @click="editSlot(props.item)"  :disabled="addVisible || bulkAddVisible || editVisible") edit
							v-icon(small @click="deleteSlot(props.item)"  :disabled="addVisible || bulkAddVisible || editVisible") delete
			.horizontal
				v-btn(@click="addSlot" color="success") Add beatmap
				v-btn(@click="addMultipleSlots" color="success") Bulk add
				v-btn(@click="saveMappool" color="success") Save
		.add-wrapper(v-if="addVisible")
			h2 Add beatmap
			.horizontal
				v-text-field(label="Beatmap ID" v-model="beatmapQuery" @keyup.enter="searchBeatmap")
				v-btn(@click="searchBeatmap" color="success") Search
			div(v-if="beatmap")
				beatmap-big(:beatmap="beatmap"  :mods="sortMods(mods)")
				.horizontal
					v-checkbox(v-model="mods" label="HD" value="HD")
					v-checkbox(v-model="mods" label="HR" value="HR")
					v-checkbox(v-model="mods" label="DT" value="DT")
					v-checkbox(v-model="mods" label="Freemod" value="Freemod")
					v-checkbox(v-model="mods" label="Tiebreaker" value="Tiebreaker")
			.horizontal
				v-btn(@click="cancel") Cancel
				v-btn(@click="addBeatmap" v-if="beatmap") Add
		.bulk-wrapper(v-if="bulkAddVisible")
			h2 Add multiple beatmaps
			v-textarea(label="Beatmaps" v-model="beatmapQuery")
			.horizontal
				v-btn(@click="cancel") Cancel
				v-btn(@click="startBulkAdd" color="success") Start
		.edit-wrapper(v-if="editVisible")
</template>

<script>
export default {
	name: 'HeadpoolerMappools',
	data: () => ({
		selectedRound: null,
		selectedTier: null,
		addVisible: false,
		bulkAddVisible: false,
		editVisible: false,
		beatmapQuery: null,
		bulkQueue: [],
		mappool: {
			_id: null,
			round: null,
			tier: null,
			slots: [],
			feedback: []
		},
		slot: {
			beatmap: Object,
			mods: []
		},
		beatmap: null,
		mods: [],
		beatmapsets: []
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
						id: null,
						round: null,
						tier: null,
						slots: [],
						feedback: []
					}
				})
			}
		},
		addSlot() {
			this.beatmapQuery = null
			this.beatmap = null
			this.mods = []
			this.addVisible = true
			this.bulkAddVisible = false
			this.editVisible = false
		},
		addMultipleSlots() {
			this.addVisible = false
			this.bulkAddVisible = true
		},
		editSlot(slot) {
			this.slot = slot
			this.addVisible = false
			this.bulkAddVisible = false
			this.editVisible = true
		},
		saveMappool() {
			this.axios.put('/api/rounds/' + this.selectedRound + '/tiers/' + this.selectedTier + '/mappool', {
				slots: mappool.slots
			})
			.then((result) => {

			})
			.catch((err) => {
				console.log(err)
			})
		},
		searchBeatmap() {
			this.axios.get('/api/osubeatmap/' + this.beatmapQuery)
			.then((result) => {
				if (result.data)
					this.beatmap = result.data
				else {
					this.axios.get('/api/osubeatmapset/' + this.beatmapQuery)
					.then((result) => {
						if (result.data)
							this.beatmapsets = [result.data]
						else {
							this.axios.get('/api/osubeatmapsetsearch/' + this.beatmapQuery)
							.then((result) => {
								this.beatmapsets = result.data
							})
							.catch((err) => {
								console.log(err)
							})
						}
					})
					.catch((err) => {
						console.log(err)
					})
				}
			})
			.catch((err) => {
				console.log(err)
			})
		},
		removeMods(mods, modsToRemove) {
			let modsChanged = false
			let modsCopy = mods.slice()
			for (let i = 0; i < modsToRemove.length; i++) {
				let index = modsCopy.indexOf(modsToRemove[i])
				if (index > -1) {
					modsCopy.splice(index, 1)
					modsChanged = true
				}
			}
			if (modsChanged)
				this.mods = modsCopy
		},
		cancel() {
			this.addVisible = false
			this.bulkAddVisible = false
			this.editVisible = false
		},
		addBeatmap() {
			this.mappool.slots.push({
				beatmap: this.beatmap,
				mods: this.mods
			})
			this.addVisible = false
		},
		startBulkAdd() {
			this.bulkQueue = this.beatmapQuery.split('\n')
			this.bulkWorker()
		},
		bulkWorker() {
			if (this.bulkQueue.length > 0) {
				var beatmapId = this.bulkQueue.shift()
				this.axios.get('/api/osubeatmap/' + beatmapId)
				.then((result) => {
					if (result.data) {
						this.mappool.slots.push({
							beatmap: result.data,
							mods: []
						})
					}
					this.bulkWorker()
				})
				.catch((err) => {
					console.log(err)
					this.bulkWorker()
				})
			} else {
				this.cancel()
			}
		},
		moveUp(slot) {
			let index = this.mappool.slots.indexOf(slot)
			if (index > 0) {
				this.mappool.slots.splice(index, 1)
				this.mappool.slots.splice(index - 1, 0, slot)
			}
		},
		moveDown(slot) {
			let index = this.mappool.slots.indexOf(slot)
			if (index < this.mappool.slots.length - 1) {
				this.mappool.slots.splice(index, 1)
				this.mappool.slots.splice(index + 1, 0, slot)
			}
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
		},
		mods(newMods, oldMods) {
			if (newMods.length) {
				switch (newMods[newMods.length - 1]) {
					case 'HD':
					case 'HR':
					case 'DT':
						this.removeMods(newMods, [ 'Freemod', 'Tiebreaker' ])
						break
					case 'Freemod':
						this.removeMods(newMods, [ 'HD', 'HR', 'DT', 'Tiebreaker' ])
						break
					case 'Tiebreaker':
						this.removeMods(newMods, [ 'HD', 'HR', 'DT', 'Freemod' ])
						break
				}
			}
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
.mappool-wrapper
	display flex
	flex-direction row
.list-wrapper
	display flex
	flex-direction column
	width 500px
.add-wrapper
	display flex
	flex-direction column
	margin-left 20px
	width 1000px
.bulk-wrapper
	display flex
	flex-direction column
	margin-left 20px
	width 300px
</style>