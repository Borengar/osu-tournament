module.exports = function(app, db, axios, config, ObjectId) {

	app.get('/api/user', (req, res, next) => {
		let collection = db.collection('users')
		collection.findOne({
			'session': req.session.id
		}, {
			projection: { '_id': 0, 'session': 0 }
		})
		.then((result) => {
			result.permissions.registration = true
			res.json(result)
		})
		.catch(next)
	})

}