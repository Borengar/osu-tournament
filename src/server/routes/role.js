module.exports = function(app, db, axios, config, ObjectId) {

	app.get('/api/roles', (req, res, next) => {
		let collection = db.collection('roles')
		collection.find({}).toArray()
		.then((roles) => {
			res.json(roles)
		})
		.catch(next)
	})

}