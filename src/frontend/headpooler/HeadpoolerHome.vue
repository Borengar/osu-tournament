<template lang="pug">
v-layout(row wrap)
	v-btn.big-button(to="/headpooler/mappools") Mappools
	v-btn.big-button(to="/headpooler/feedback") Feedback
</template>

<script>
export default {
	name: 'HeadpoolerHome'
}
</script>

<style lang="stylus" scoped>
.big-button
	width 200px
	height 200px
</style>