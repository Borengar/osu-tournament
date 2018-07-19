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

	app.get('/api/osubeatmapset/:beatmapsetId', (req, res, next) => {
		osu.getBeatmapset(req.params.beatmapsetId)
		.then((beatmapset) => {
			res.json(beatmapset)
		})
		.catch(next)
	})

	app.get('/api/osubeatmapsetsearch/:query', (req, res, next) => {
		osu.searchBeatmapset(req.params.query)
		.then((beatmapsets) => {
			res.json(beatmapsets)
		})
		.catch(next)
	})

}