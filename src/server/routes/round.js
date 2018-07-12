module.exports = function(app, db, axios, config, ObjectId) {

	app.get('/api/rounds', (req, res, next) => {
		let collection = db.collection('rounds')
		collection.find({}).toArray()
		.then((result) => {
			res.json(result)
		})
		.catch(next)
	})

	app.post('/api/rounds', (req, res, next) => {
		let collection = db.collection('rounds')
		let round = req.body.round
		delete round._id
		collection.insertOne(round)
		.then((result) => {
			calculateRounds(db)
			res.json({ message: 'Round saved' })
		})
		.catch(next)
	})

	app.put('/api/rounds/:roundId', (req, res, next) => {
		let collection = db.collection('rounds')
		let round = req.body.round
		delete round._id
		collection.findOneAndUpdate({
			'_id': ObjectId(req.params.roundId)
		}, {
			$set: round
		})
		.then((result) => {
			calculateRounds(db)
			res.json({ message: 'Round saved' })
		})
		.catch(next)
	})

	app.delete('/api/rounds/:roundId', (req, res, next) => {
		let collection = db.collection('rounds')
		collection.deleteOne({
			'_id': ObjectId(req.params.roundId)
		})
		.then((result) => {
			calculateRounds(db)
			res.json({ message: 'Round deleted' })
		})
		.catch(next)
	})

	function calculateRounds(db, roundId) {
		let collection = db.collection('rounds')
		if (roundId) {
			collection.findOne({
				'_id': ObjectId(roundId)
			})
			.then((round) => {
				Promise.all([
					collection.find({
						'canContinue': true,
						'continueRound': roundId
					}).toArray(),
					collection.find({
						'canDropDown': true,
						'dropDownRound': roundId
					}).toArray()
				])
				.then(([continueRounds, dropDownRounds]) => {
					let playerAmount = 0
					for (let i = 0; i < continueRounds.length; i++) {
						playerAmount += continueRounds[i].playerAmount / continueRounds[i].lobbySize * continueRounds[i].continueAmount
					}
					for (let i = 0; i < dropDownRounds.length; i++) {
						playerAmount += dropDownRounds[i].playerAmount / dropDownRounds[i].lobbySize * dropDownRounds[i].dropDownAmount
					}
					collection.findOneAndUpdate({
						'_id': ObjectId(roundId)
					}, {
						$set: {
							'playerAmount': playerAmount
						}
					})
					.then((result) => {
						if (round.canContinue && round.continueRound) {
							calculateRounds(db, round.continueRound)
						}
						if (round.canDropDown && round.dropDownRound) {
							calculateRounds(db, round.dropDownRound)
						}
					})
					.catch((err) => {
						console.log(err)
					})
				})
				.catch((err) => {
					console.log(err)
				})
			})
			.catch((err) => {
				console.log(err)
			})
		} else {
			collection.findOne({
				'firstRound': true
			})
			.then((round) => {
				if (round) {
					if (round.canContinue && round.continueRound) {
						calculateRounds(db, round.continueRound)
					}
					if (round.canDropDown && round.dropDownRound) {
						calculateRounds(db, round.dropDownRound)
					}
				}
			})
			.catch((err) => {
				console.log(err)
			})
		}
	}

}