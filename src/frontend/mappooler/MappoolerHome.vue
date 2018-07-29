<template lang="pug">
.wrapper
	v-btn.big-button(to="/mappooler/mappools") Mappools
	v-btn.big-button(to="/mappooler/feedback") Feedback
</template>

<script>
export default {
	name: 'MappoolerHome'
}
</script>

<style lang="stylus" scoped>
.wrapper
	flex-direction row
	flex-wrap wrap
.big-button
	width 200px
	height 200px
</style>