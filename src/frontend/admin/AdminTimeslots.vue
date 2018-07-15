<template lang="pug">
.wrapper
	.list-wrapper
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
		v-btn(@click="createTimeslot" color="success") New timeslot
	.edit-wrapper(v-if="editVisible" v-model="editValid")
		h2 New timeslot
		v-select(label="Day" v-model="timeslot.day" :items="days")
		v-time-picker(v-model="timeslot.time" format="24hr")
		.horizontal
			v-btn(@click="cancel") Cancel
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
.day-field
	width 150px
	margin-right 10px
.time-field
	width 50px
.time-separator
	margin 27px 10px 0 10px
</style>