const axios = require('axios')

class OsuApi {
	constructor(options = {}) {
		this.apiKey = options.apiKey
		this.username = options.username
		this.password = options.password
	}

	connect() {
		return axios.post('https://osu.ppy.sh/oauth/token', {
			username: this.username,
			password: this.password,
			grant_type: 'password',
			client_id: '5',
			client_secret: 'FGc9GAtyHzeQDshWP5Ah7dega8hJACAJpQtw6OXk'
		})
		.then((result) => {
			this.accessToken = result.data.access_token
			this.refreshToken = result.data.refresh_token
			setTimeout(this.refreshApiToken, (result.data.expires_in - 3600) * 1000)
			return 'connected'
		})
	}

	refreshApiToken() {
		axios.post('https://osu.ppy.sh/oauth/token', {
			refresh_token: this.refreshToken,
			grant_type: 'refresh_token',
			client_id: '5',
			client_secret: 'FGc9GAtyHzeQDshWP5Ah7dega8hJACAJpQtw6OXk'
		})
		.then((result) => {
			this.accessToken = result.data.access_token
			this.refreshToken = result.data.refresh_token
			setTimeout(this.refreshApiToken, (result.data.expires_in - 3600) * 1000)
		})
		.catch((err) => {
			console.log(err)
			setTimeout(this.refreshApiToken, 60000)
		})
	}

	getUserId(name) {
		if (Number.isInteger(name)) {
			return Promise.resolve(name)
		}
		return axios.get(`https://osu.ppy.sh/api/get_user?k=${this.apiKey}&u=${name}&type=string`)
		.then((result) => {
			if (!result.data.length) {
				return Promise.reject('User not found')
			}
			return result.data[0].user_id
		})
	}

	getUserProfile(userId) {
		return axios.get(`https://osu.ppy.sh/api/v2/users/${userId}/osu`, {
			headers: { 'Authorization': `Bearer ${this.accessToken}` }
		})
		.then((result) => {
			return result.data
		})
	}

	getBeatmap(beatmapId) {
		return axios.get(`https://osu.ppy.sh/api/v2/beatmaps/${beatmapId}`, {
			headers: { 'Authorization': `Bearer ${this.accessToken}` }
		})
		.then((result) => {
			return result.data
		})
	}
}

module.exports = OsuApi