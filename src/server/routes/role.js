module.exports = function(app, db, axios, config, ObjectId) {

	app.get('/api/roles', (req, res, next) => {
		let collection = db.collection('roles')
		collection.find({}).toArray()
		.then((roles) => {
			res.json(roles)
		})
		.catch(next)
	})

	app.put('/api/roles/:roleId', (req, res, next) => {
		let collection = db.collection('roles')
		let role = req.body.role
		delete role._id
		collection.findOneAndUpdate({
			'_id': ObjectId(req.params.roleId)
		}, {
			$set: role
		})
		.then((result) => {
			res.json({ message: 'Role saved' })
		})
		.catch(next)
	})

	app.post('/api/roles', (req, res, next) => {
		let collection = db.collection('roles')
		let role = req.body.role
		delete role._id
		collection.insertOne(role)
		.then((result) => {
			res.json({ message: 'Role saved' })
		})
		.catch(next)
	})

	app.delete('/api/roles/:roleId', (req, res, next) => {
		let collection = db.collection('roles')
		collection.deleteOne({
			'_id': ObjectId(req.params.roleId)
		})
		.then((result) => {
			res.json({ message: 'Role deleted' })
		})
		.catch(next)
	})

}