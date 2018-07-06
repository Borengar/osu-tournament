module.exports = function(app, db, acl, axios, config, ObjectId) {

	app.post('/api/registrations', (req, res, next) => {
		axios.get('https://osu.ppy.sh/users/' + req.body.osuId)
		.then((response) => {
			let $ = cheerio.load(response.data)
			let userData = JSON.parse($('#json-user').html())
			let osuProfile = {
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
			}
			let collection = db.collection('users')
			collection.findOneAndUpdate({
				'session': req.session.id
			}, {
				$set: {
					'osu': osuProfile,
					'registration': {
						'time': new Date().toISOString(),
						'active': true
					}
				}
			})
			.then((result) => {
				res.json({ message: 'Registration successfull' })
			})
			.catch(next)
		})
	})

	app.delete('/api/registrations', (req,res) => {
		let collection = db.collection('users')
		collection.findOneAndUpdate({
			'session': req.session.id
		}, {
			$set: {
				'registration.active': false
			}
		})
		.then((result) => {
			res.json({ message: 'Registration deleted' })
		})
		.catch(next)
	})

}