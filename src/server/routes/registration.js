module.exports = function(app, db, axios, config, ObjectId, discord, osu) {

	app.get('/api/registrations', (req, res, next) => {
		let collection = db.collection('users')
		collection.find({
			'registration.active': true
		}, {
			projection: { 'session': 0 }
		}).sort('registration.time', 1).toArray()
		.then((result) => {
			res.json(result)
		})
		.catch(next)
	})

	app.post('/api/registrations', (req, res, next) => {
		osu.getUserProfile(req.body.osuId)
		.then((profile) => {
			let collection = db.collection('users')
			return collection.findOneAndUpdate({
				'session': req.session.id
			}, {
				$set: {
					'osu': profile,
					'registration.active': true
				},
				$currentDate: {
					'registration.time': true,
					'cacheUpdate': true
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

	app.put('/api/registrations/:userId/discordAccount', (req, res, next) => {
		let collection = db.collection('users')
		let guild = discord.guilds.first()
		let member = guild.member(req.body.id)
		collection.findOneAndUpdate({
			'_id': ObjectId(req.params.userId)
		}, {
			$set: {
				'discord': {
					'id': member.user.id,
					'username': member.user.username,
					'discriminator': member.user.discriminator,
					'avatar': member.user.avatar
				}
			}
		})
		.then((result) => {
			res.json({ message: 'Discord account changed' })
		})
		.catch(next)
	})

	app.delete('/api/registrations/:userId', (req, res, next) => {
		let collection = db.collection('users')
		collection.findOneAndUpdate({
			'_id': ObjectId(req.params.userId)
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