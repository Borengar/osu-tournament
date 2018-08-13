module.exports = function(app, db, axios, config, ObjectId, discord, osu) {

	app.get('/api/rounds/:roundId/tiers/:tierId/lobbies', (req, res, next) => {
		let collection = db.collection('lobbies')
		collection.find({
			'round': ObjectId(req.params.roundId),
			'tier': ObjectId(req.params.tierId)
		}).toArray()
		.then((lobbies) => {
			res.json(lobbies)
		})
		.catch(next)
	})

	app.post('/api/rounds/:roundId/tiers/:tierId/lobbies', (req, res, next) => {
		let roundCollection = db.collection('rounds')
		let lobbyCollection = db.collection('lobbies')

		roundCollection.findOne({
			'_id': ObjectId(req.params.roundId)
		})
		.then((round) => {
			let lobbies = []
			for (let i = 0; i < round.playerAmount / round.lobbySize; i++) {
				let lobby = {
					round: ObjectId(req.params.roundId),
					tier: ObjectId(req.params.tierId),
					slots: []
				}
				for (let j = 0; j < round.lobbySize; j++) {
					lobby.slots.push({
						player: null,
						continues: null
					})
				}
				lobbies.push(lobby)
			}
			return lobbyCollection.insertMany(lobbies)
		})
		.then((result) => {
			res.json({ message: 'Lobbies created' })
		})
		.catch(next)
	})

	app.put('/api/lobbies', (req, res, next) => {
		let collection = db.collection('lobbies')
		let lobbies = req.body.lobbies
		let updates = []
		for (let i = 0; i < lobbies.length; i++) {
			updates.push(collection.findOneAndUpdate({
				'_id': ObjectId(lobbies[i]._id)
			}, {
				$set: {
					'slots': lobbies[i].slots
				}
			}))
		}
		Promise.all(updates)
		.then((result) => {
			res.json({ message: 'Lobbies saved' })
		})
		.catch(next)
	})

	app.delete('/api/rounds/:roundId/tiers/:tierId/lobbies', (req, res, next) => {
		let collection = db.collection('lobbies')
		collection.deleteMany({
			'round': ObjectId(req.params.roundId),
			'tier': ObjectId(req.params.tierId)
		})
		.then((result) => {
			res.json({ message: 'Lobbies deleted' })
		})
		.catch(next)
	})

}