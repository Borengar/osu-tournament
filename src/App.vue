<template lang="pug">
#app.vertical
	.flex
	.horizontal
		.flex
		md-button.md-raised.login-button(@click="login") Login
		.flex
</template>

<script>
export default {
	name: 'App',
	data() {
		return {
			login() {
				window.open('https://discordapp.com/oauth2/authorize?client_id=449942605585842189&scope=identify&redirect_uri=' + encodeURI('http://localhost') + '&response_type=token', '_self');
			}
		}
	},
	created() {
		var token = null;
		this.$route.hash.substring(1).split('&').forEach(function(element) {
			var splits = element.split('=');
			if (splits[0] == 'access_token')
				token = splits[1];
		});
		var self = this;
		this.$axios.post('/api/discordlogin', {
			token: token
		})
		.then(function(response) {
			if (response.status == 200) {
				self.$router.push('/registration');
			}
		})
		.catch(function(error) {
			console.log(error);
		})
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
.login-button
	width 200px
	height 200px
	margin-bottom 20px
	border-radius 50%
	font-size 30px
</style>