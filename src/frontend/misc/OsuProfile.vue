<template lang="pug">
.wrapper
	.empty(v-if="!profile") ?
	.avatar(v-if="profile" v-bind:style="{ 'background-image': 'url(' + profile.avatarUrl + ')' }")
	.username(v-if="profile") {{ profile.username }}
	.pp(v-if="profile") Performance: {{ profile.pp }}pp
	.acc(v-if="profile") Accuracy: {{ profile.hitAccuracy }}%
	.playcount(v-if="profile") Play Count: {{ profile.playCount }} (LV{{ profile.level }})
	.rank(v-if="profile") \#{{ profile.rank }}
</template>

<script>
export default {
	name: 'OsuProfile',
	props: {
		profile: Object
	},
	computed: {
		isEmpty() {
			if (this.profile && this.profile.username) {
				return false
			}
			return true
		}
	}
}
</script>

<style lang="stylus" scoped>
.wrapper
	max-width 400px
	min-width 400px
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
	bottom 0px
	font-size 40px
	opacity 0.5
.empty
	position absolute
	left 185px
	font-size 70px
</style>