module.exports = function(app, db, acl, axios, config, ObjectId) {

	app.get('/api/timeslots', (req, res, next) => {
		let collection = db.collection('timeslots')
		collection.find({}).toArray()
		.then((result) => {
			res.json(result)
		})
		.catch(next)
	})

	app.post('/api/timeslots', (req, res, next) => {
		let collection = db.collection('timeslots')
		let timeslot = req.body.timeslot
		delete timeslot._id
		collection.insertOne(timeslot)
		.then((result) => {
			res.json({ message: 'Timeslot saved' })
		})
		.catch(next)
	})

	app.put('/api/timeslots/:timeslotId', (req, res, next) => {
		let collection = db.collection('timeslots')
		let timeslot = req.body.timeslot
		delete timeslot._id
		collection.findOneAndUpdate({
			'_id': ObjectId(req.params.timeslotId)
		}, {
			$set: timeslot
		})
		.then((result) => {
			res.json({ message: 'Timeslot saved' })
		})
		.catch(next)
	})

	app.delete('/api/timeslots/:timeslotId', (req, res, next) => {
		let collection = db.collection('timeslots')
		collection.deleteOne({
			'_id': ObjectId(req.params.timeslotId)
		})
		.then((result) => {
			res.json({ message: 'Timeslot deleted' })
		})
		.catch(next)
	})

}