<template lang="pug">
.wrapper.horizontal
	.avatar(:style='avatarUrl')
	.username {{ profile.username }}\#{{ profile.discriminator }}
</template>

<script>
export default {
	name: 'DiscordProfile',
	props: {
		profile: Object
	},
	computed: {
		avatarUrl: function() {
			if (this.profile.id)
				return { 'background-image': 'url(https://cdn.discordapp.com/avatars/' + this.profile.id + '/' + this.profile.avatar + '.gif?size=256)' }
			return ''
		}
	}
}
</script>

<style lang="stylus" scoped>
.wrapper
	width 300px
	height 64px
.horizontal
	display flex
	flex-direction row
.avatar
	width 50px
	height 50px
	border-radius 50%
	background-size 50px 50px
	margin 7px 10px
.username
	line-height 64px
	font-size 20px
</style>