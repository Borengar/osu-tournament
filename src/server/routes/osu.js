module.exports = function(app, db, axios, config, ObjectId, discord, osu) {

	app.get('/api/osuprofile/:userId', (req, res, next) => {
		osu.getUserId(req.params.userId)
		.then((userId) => {
			return osu.getUserProfile(userId)
		})
		.then((profile) => {
			res.json(profile)
		})
		.catch(next)
	})

	app.get('/api/osubeatmap/:beatmapId', (req, res, next) => {
		osu.getBeatmap(req.params.beatmapId)
		.then((beatmap) => {
			res.json(beatmap)
		})
		.catch(next)
	})

}