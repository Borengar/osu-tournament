<template lang="pug">
.wrapper
	h1 PROJECT REKINDLING
	div Welcome to the Project REKINDLING Registration!
	div By going through the previous page you've registered on our site with your Discord account. Input your osu! username below to link your osu! account with our site and to register for the tournament.
	div There are a limited amount of slots so the earlier you register, the more likely you'll make it in!
	div If your registration is accepted you will be automatically assigned the appropriate Discord role on our server.
	h2 Your osu! account
	.horizontal
		md-field.search-input
			label osu! ID or username
			md-input(v-model="osuUsername")
		md-button.md-raised.search-button(@click="search") Search
	osu-profile(v-bind:profile="osuProfile")
</template>

<script>
export default {
	name: 'Registration',
	data() {
		return {
			osuUsername: '',
			osuProfile: Object
		}
	},
	methods: {
		search() {
			this.axios.get('/api/osuprofile/' + this.osuUsername)
			.then((response) => {
				this.osuProfile = response.data
			})
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
.search-input
	width 200px
.search-button
	margin-top 15px
	background-color #2e3136 !important
	color white !important
</style>