<template lang="pug">
.wrapper
	v-btn.big-button(to="/headpooler/mappools") Mappools
	v-btn.big-button(to="/headpooler/feedback") Feedback
</template>

<script>
export default {
	name: 'HeadpoolerHome'
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