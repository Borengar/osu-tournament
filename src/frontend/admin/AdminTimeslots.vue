<template lang="pug">
.wrapper
	.list-wrapper
		h2 Timeslots
		md-table(v-model="timeslots" md-card @md-selected="selectTimeslot")
			md-table-row(slot="md-table-row" slot-scope="{ item }" md-selectable="single" md-auto-select)
				md-table-cell(md-label="Day") {{ item.day }}
				md-table-cell(md-label="Time") {{ item.hour }}:{{ item.minute }} UTC
		md-button.md-raised.new-button(@click="newTimeslot") Add
	.edit-wrapper(v-if="editVisible")
		h2 {{ editHeader }}
		.horizontal
			md-field.day-field(:class="dayClass")
				label Day
				md-select(v-model="timeslot.day" required)
					md-option(value="Monday") Monday
					md-option(value="Tuesday") Tuesday
					md-option(value="Wednesday") Wednesday
					md-option(value="Thursday") Thursday
					md-option(value="Friday") Friday
					md-option(value="Saturday") Saturday
					md-option(value="Sunday") Sunday
			md-field.time-field(:class="hourClass")
				label Hour
				md-input(v-model="timeslot.hour" type="number" required)
			.time-separator -
			md-field.time-field(:class="minuteClass")
				label Minute
				md-input(v-model="timeslot.minute" type="number" required)
		.horizontal
			md-button.md-raised.save-button(@click="saveTimeslot") Save
			md-button.md-raised.md-accent.delete-button(@click="deleteTimeslot" v-if="timeslot._id") Delete
	md-dialog-alert(:md-active.sync="errorVisible" md-title="Invalid input" md-content="Please check your inputs!")
</template>

<script>
export default {
	name: 'AdminTimeslots',
	data: () => ({
		editHeader: '',
		editVisible: false,
		errorVisible: false,
		timeslot: {
			_id: '',
			day: '',
			hour: '',
			minute: ''
		}
	}),
	computed: {
		timeslots() {
			return this.$store.state.timeslots
		},
		dayClass() {
			return { 'md-invalid': !this.timeslot.day }
		},
		hourClass() {
			return { 'md-invalid': this.timeslot.hour.length != 2 || this.timeslot.hour < 0 || this.timeslot.hour >= 24 }
		},
		minuteClass() {
			return { 'md-invalid': this.timeslot.minute.length != 2 || this.timeslot.minute < 0 || this.timeslot.minute >= 60 }
		}
	},
	methods: {
		newTimeslot() {
			this.editHeader = 'New timeslot'
			this.timeslot = {
				_id: '',
				day: 'Friday',
				hour: '00',
				minute: '00'
			}
			this.editVisible = true
		},
		selectTimeslot(timeslot) {
			this.timeslot = timeslot
			this.editHeader = 'Edit timeslot'
			this.editVisible = true
		},
		saveTimeslot() {
			if (this.validate()) {
				if (this.timeslot._id) {
					this.axios.put('/api/timeslots/' + this.timeslot._id, {
						timeslot: this.timeslot
					})
					.then((result) => {
						this.editVisible = false
						this.$store.dispatch('getTimeslots')
					})
					.catch((err) => {
						console.log(err)
					})
				} else {
					this.axios.post('/api/timeslots/', {
						timeslot: this.timeslot
					})
					.then((result) => {
						this.editVisible = false
						this.$store.dispatch('getTimeslots')
					})
					.catch((err) => {
						console.log(err)
					})
				}
			} else {
				this.errorVisible = true
			}
		},
		deleteTimeslot() {
			this.axios.delete('/api/timeslots/' + this.timeslot._id)
			.then((result) => {
				this.editVisible = false
				this.$store.dispatch('getTimeslots')
			})
			.catch((err) => {
				console.log(err)
			})
		},
		validate() {
			if (!this.timeslot.day) return false
			if (this.timeslot.hour.length != 2 || this.timeslot.hour < 0 || this.timeslot.hour >= 24) return false
			if (this.timeslot.minute.length != 2 || this.timeslot.minute < 0 || this.timeslot.minute >= 60) return false
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