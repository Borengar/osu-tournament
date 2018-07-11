module.exports = function(app, db, axios, config, ObjectId) {

	app.get('/api/user', (req, res, next) => {
		let collection = db.collection('users')
		collection.findOne({
			'session': req.session.id
		})
		.then((result) => {
			res.json({
				discord: result.discord,
				osu: result.osu,
				registration: result.registration,
				permissions: result.permissions
			})
		})
		.catch(next)
	})

}