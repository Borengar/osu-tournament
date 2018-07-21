module.exports = function(app, db, axios, config, ObjectId, discord, osu) {

	app.post('/api/registrations', (req, res, next) => {
		osu.getUserProfile(req.body.osuId)
		.then((profile) => {
			let collection = db.collection('users')
			return collection.findOneAndUpdate({
				'session': req.session.id
			}, {
				$set: {
					'osu': profile,
					'registration': {
						'time': new Date().toISOString(),
						'active': true
					}
				}
			})
		})
		.then((result) => {
			res.json({ message: 'Registration successfull' })
		})
		.catch(next)
	})

	app.delete('/api/registrations', (req, res, next) => {
		let collection = db.collection('users')
		collection.findOneAndUpdate({
			'session': req.session.id
		}, {
			$set: {
				'registration': {
					'active': false,
					'time': null
				}
			}
		})
		.then((result) => {
			res.json({ message: 'Registration deleted' })
		})
		.catch(next)
	})

}