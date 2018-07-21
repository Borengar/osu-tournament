module.exports = function(app, db, axios, config, ObjectId) {

	app.get('/api/settings', (req, res, next) => {
		let collection = db.collection('settings')
		collection.findOne({}, {
			projection: { '_id': 0 }
		})
		.then((settings) => {
			res.json(settings)
		})
		.catch(next)
	})

	app.put('/api/settings/registration', (req, res, next) => {
		let collection = db.collection('settings')
		collection.findOneAndUpdate({}, {
			$set: {
				registration: req.body.registration
			}
		})
		.then((result) => {
			res.json({ message: 'Settings updated' })
		})
		.catch(next)
	})

}