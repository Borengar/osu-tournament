<template lang="pug">
md-app(md-waterfall md-mode="fixed")
	md-app-toolbar.md-primary
		span.md-title.flex {{ routeName }}
		discord-profile(v-bind:profile="discordProfile")
	md-app-content
		router-view
</template>

<script>
export default {
	name: 'app',
	data() {
		return {

		}
	},
	computed: {
		discordProfile() {
			return this.$store.state.user.discord
		},
		routeName() {
			return this.$route.name
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
#app
	background-image url('./index_header.png')
	background-repeat no-repeat
	background-size 100%
	height 100%
.md-app
	height 100%
</style>