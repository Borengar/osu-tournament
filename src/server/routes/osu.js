module.exports = function(app, db, acl, axios, config, ObjectId) {

	app.get('/api/osuprofile/:userId', (req, res, next) => {
		axios.get('https://osu.ppy.sh/users/' + req.params.userId)
		.then((response) => {
			let $ = cheerio.load(response.data)
			let userData = JSON.parse($('#json-user').html())
			res.json({
				id: userData.id,
				username: userData.username,
				avatarUrl: userData.avatar_url,
				hitAccuracy: userData.statistics.hit_accuracy,
				level: userData.statistics.level.current,
				playCount: userData.statistics.play_count,
				pp: userData.statistics.pp,
				rank: userData.statistics.rank.global,
				playstyle: userData.playstyle.join(' + '),
				country: userData.country.code
			})
		})
		.catch(next)
	})

}