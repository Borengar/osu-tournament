module.exports = function(app, db, axios, config, ObjectId, discord, osu) {

	app.get('/api/rounds/:roundId/tiers/:tierId/mappool', (req, res, next) => {
		let collection = db.collection('mappools')
		collection.findOne({
			'round': ObjectId(req.params.roundId),
			'tier': ObjectId(req.params.tierId)
		})
		.then((mappool) => {
			if (mappool) {
				res.json(mappool)
			} else {
				return collection.insertOne({
					round: ObjectId(req.params.roundId),
					tier: ObjectId(req.params.tierId),
					slots: [],
					feedback: []
				})
				.then((result) => {
					return collection.findOne({
						'round': ObjectId(req.params.roundId),
						'tier': ObjectId(req.params.tierId)
					})
				})
				.then((mappool) => {
					res.json(mappool)
				})
			}
		})
		.catch((err) => {
			console.log(err)
		})
	})

}