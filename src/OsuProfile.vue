<template lang="pug">
.wrapper
	.avatar(v-bind:style="{ 'background-image': 'url(' + profile.avatarUrl + ')' }")
	.username {{ profile.username }}
	.pp Performance: {{ profile.pp }}pp
	.acc Accuracy: {{ profile.hitAccuracy }}%
	.playcount Play Count: {{ profile.playCount }} (LV{{ profile.level }})
	.rank \#{{ profile.rank }}
</template>

<script>
export default {
	name: 'OsuProfile',
	props: {
		profile: Object
	}
}
</script>

<style lang="stylus" scoped>
.wrapper
	width 400px
	height 100px
	background-color #090909
	color white
	position relative
.avatar
	position absolute
	height 90px
	width 90px
	top 5px
	left 5px
	background-size 90px 90px
.username, .pp, .acc, .playcount
	position absolute
	left 100px
.pp, .acc, .playcount
	font-size 14px
.username
	font-size 20px
	top 5px
.pp
	top 32px
.acc
	top 50px
.playcount
	top 68px
.rank
	position absolute
	right 5px
	bottom 10px
	font-size 40px
	opacity 0.5
</style>