module.exports = function(app, db, acl, axios, config, ObjectId) {

	app.get('/api/user', (req, res, next) => {
		let collection = db.collection('users')
		collection.findOne({
			'session': req.session.id
		})
		.then((result) => {
			acl.userRoles(req.session.id)
			.then((roles) => {
				res.json({
					discord: result.discord,
					osu: result.osu,
					registration: result.registration,
					roles: roles
				})
			})
			.catch(next)
		})
		.catch(next)
	})

}