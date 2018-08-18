<template lang="pug">
v-layout(column align-center)
	v-flex(md6)
		img.header-image(src="./images/index_header.png")
	v-flex(md6)
		v-btn.md-raised.login-button(@click="login") Login
</template>

<script>
export default {
	name: 'Home',
	data() {
		return {
			login() {
				window.open('https://discordapp.com/oauth2/authorize?client_id=449942605585842189&scope=identify&redirect_uri=' + encodeURI('http://localhost') + '&response_type=token', '_self')
			}
		}
	},
	created() {
		var token = null
		this.$route.hash.substring(1).split('&').forEach((element) => {
			var splits = element.split('=')
			if (splits[0] == 'access_token')
				token = splits[1]
		})
		var self = this
		this.axios.post('/api/discordlogin', {
			token: token
		})
		.then((response) => {
			if (response.status == 200) {
				self.$router.push('/registration')
			}
		})
		.catch((err) => {
			console.log(err)
		})
	}
}
</script>

<style lang="stylus" scoped>
.header-image
	max-width 100%
.login-button
	width 200px
	height 200px
	margin-bottom 20px
	border-radius 50%
	font-size 30px
	background-color #2e3136 !important
	color white !important
</style>