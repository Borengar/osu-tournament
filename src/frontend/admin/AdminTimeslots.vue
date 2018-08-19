<template lang="pug">
v-layout(row)
	v-flex(lg6).mr-5
		v-layout(column)
			h2 Timeslots
			v-data-table.elevation-1(:items="timeslots" item-key="_id")
				template(slot="headers" slot-scope="props")
					tr
						th(align="left") Day
						th(align="left") Time
						th(align="right") Actions
				template(slot="items" slot-scope="props")
					tr
						td.text-xs-left {{ props.item.day }}
						td.text-xs-left {{ props.item.time }}
						td.text-xs-right
							v-icon(small @click="deleteTimeslot(props.item)" :disabled="editVisible") delete
			v-btn.mx-0(@click="createTimeslot" color="success") New timeslot
	v-flex(lg6)
		v-layout(column v-if="editVisible").edit-wrapper
			h2 New timeslot
			v-select(label="Day" v-model="timeslot.day" :items="days")
			v-time-picker(v-model="timeslot.time" format="24hr")
			div
				v-btn.ml-0(@click="cancel") Cancel
				v-btn(@click="saveTimeslot" color="success") Save
</template>

<script>
export default {
	name: 'AdminTimeslots',
	data: () => ({
		editVisible: false,
		editValid: false,
		timeslot: {
			_id: '',
			day: '',
			time: ''
		},
		days: [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ]
	}),
	computed: {
		timeslots() {
			return this.$store.state.timeslots
		}
	},
	methods: {
		createTimeslot() {
			this.timeslot = {
				_id: '',
				day: 'Friday',
				time: '00:00'
			}
			this.editVisible = true
		},
		saveTimeslot() {
			this.axios.post('/api/timeslots/', {
				timeslot: {
					id: this.timeslot.day + this.timeslot.time,
					day: this.timeslot.day,
					time: this.timeslot.time
				}
			})
			.then((result) => {
				this.editVisible = false
				this.$store.dispatch('getTimeslots')
			})
			.catch((err) => {
				console.log(err)
			})
		},
		deleteTimeslot(timeslot) {
			this.axios.delete('/api/timeslots/' + timeslot._id)
			.then((result) => {
				this.$store.dispatch('getTimeslots')
			})
			.catch((err) => {
				console.log(err)
			})
		},
		cancel() {
			this.editVisible = false
		}
	}
}
</script>

<style lang="stylus" scoped>
.edit-wrapper
	width 290px
</style>