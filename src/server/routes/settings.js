module.exports = function(app, db, axios, config, ObjectId) {

	app.get('/api/settings', (req, res, next) => {
		let collection = db.collection('settings')
		collection.findOne({})
		.then((settings) => {
			res.json(settings)
		})
		.catch(next)
	})

	app.put('/api/settings/roles', (req, res, next) => {
		let collection = db.collection('settings')
		let roles = req.body.roles
		collection.findOneAndUpdate({}, {
			$set: {
				roles: roles
			}
		})
		.then(() => {
			res.json({ message: 'Roles saved' })
		})
		.catch(next)
	})

}