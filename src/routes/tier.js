module.exports = function(app, db, acl, axios, config) {

	app.get('/api/tiers', (req, res) => {
		let collection = db.collection('tiers')
		collection.find({}).toArray()
		.then((tiers) => {
			res.json(tiers)
		})
		.catch((err) => {
			console.log(err)
			res.sendStatus(500)
		})
	})

	app.put('/api/tiers/:tierId', (req, res) => {
		let collection = db.collection('tiers')
		let tier = req.body.tier
		delete tier._id
		collection.findOneAndUpdate({
			'_id': ObjectId(req.params.tierId)
		}, {
			$set: tier
		})
		.then((result) => {
			res.json({ message: 'Tier saved' })
		})
		.catch((err) => {
			console.log(err)
			res.sendStatus(500)
		})
	})

	app.post('/api/tiers', (req, res) => {
		let collection = db.collection('tiers')
		let tier = req.body.tier
		delete tier._id
		collection.insertOne(tier)
		.then((result) => {
			res.json({ message: 'Tier saved' })
		})
		.catch((err) => {
			console.log(err)
			res.sendStatus(500)
		})
	})

	app.delete('/api/tiers/:tierId', (req, res) => {
		let collection = db.collection('tiers')
		collection.deleteOne({
			'_id': ObjectId(req.params.tierId)
		})
		.then((result) => {
			res.json({ message: 'Tier deleted' })
		})
		.catch((err) => {
			console.log(err)
			res.sendStatus(500)
		})
	})
	
}