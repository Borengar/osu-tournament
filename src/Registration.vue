<template lang="pug">
md-app(md-waterfall md-mode="fixed")
	md-app-toolbar.md-primary
		span.md-title.flex Registration
	md-app-content
</template>

<script>
export default {
	name: 'Registration',
	data() {
		return {

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
md-app
	height 100%
</style>