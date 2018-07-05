module.exports = function(app, db, acl, axios, config) {

	app.get('/api/rounds', (req, res) => {
		let collection = db.collection('rounds')
		collection.find({}).toArray()
		.then((result) => {
			res.json(result)
		})
		.catch((err) => {
			console.log(err)
			res.sendStatus(500)
		})
	})

	app.post('/api/rounds', (req, res) => {
		let collection = db.collection('rounds')
		let round = req.body.round
		delete round._id
		collection.insertOne(round)
		.then((result) => {
			calculateRounds(db)
			res.json({ message: 'Round saved' })
		})
		.catch((err) => {
			console.log(err)
			res.sendStatus(500)
		})
	})

	app.put('/api/rounds/:roundId', (req, res) => {
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
		.catch((err) => {
			console.log(err)
			res.sendStatus(500)
		})
	})

	app.delete('/api/rounds/:roundId', (req, res) => {
		let collection = db.collection('rounds')
		collection.deleteOne({
			'_id': ObjectId(req.params.roundId)
		})
		.then((result) => {
			calculateRounds(db)
			res.json({ message: 'Round deleted' })
		})
		.catch((err) => {
			console.log(err)
			res.sendStatus(500)
		})
	})

}