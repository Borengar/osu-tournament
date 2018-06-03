<template lang="pug">

</template>

<script>
export default {
	name: 'Registration',
	data() {
		return {

		}
	},
	computed: {
		discordProfile() {
			return this.$store.state.user.discord
		}
	}
}
</script>

<style lang="stylus" scoped>
.flex
	flex 1 0
.no-flex
	flex 0 0
.horizontal
	display flex
	flex-direction row
.vertical
	display flex
	flex-direction column
.md-app
	height 100%
</style>