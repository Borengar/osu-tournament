module.exports = function(app, db, axios, config, ObjectId, discord, osu) {

	app.get('/api/players', (req, res, next) => {
		let collection = db.collection('users')
		collection.find({
			'player': { $exists: true }
		}).toArray()
		.then((players) => {
			res.json(players)
		})
		.catch(next)
	})

	app.post('/api/players', (req, res, next) => {
		let tierCollection = db.collection('tiers')
		let roundCollection = db.collection('rounds')
		let userCollection = db.collection('users')

		Promise.all([
			tierCollection.find({}).toArray(),
			roundCollection.find({}).toArray(),
			userCollection.aggregate([
				{ $match: { 'registration.active': true } },
				{ $sort: { 'registration.time': 1 } }
			]).toArray()
		])
		.then(([tiers, rounds, users]) => {
			let updates = []
			for (let tierCounter = 0; tierCounter < tiers.length; tierCounter++) {
				let tier = tiers[tierCounter]
				let round = rounds.find((round) => {
					return round._id == tier.startingRound
				})
				let registrations = users.filter((user) => {
					return user.osu.rank >= tier.lowerEnd && user.osu.rank <= tier.upperEnd
				})
				if (registrations.length > 0) {
					let lastTime = null
					if (registrations.length >= round.playerAmount) {
						lastTime = registrations[round.playerAmount - 1].registration.time
					} else {
						lastTime = registrations[registrations.length - 1].registration.time
					}
					updates.push(userCollection.updateMany({
						'registration.active': true,
						'registration.time': { $lte: lastTime }
					}, {
						$set: {
							player: {
								tier: tier
							}
						}
					}))
				}
			}
			return Promise.all(updates)
		})
		.then((result) => {
			res.json({ message: 'Players created' })
		})
		.catch(next)
	})

}