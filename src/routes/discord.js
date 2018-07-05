module.exports = function(app, db, acl, axios, config, ObjectId) {

	app.post('/api/discordlogin', (req, res, next) => {
		axios({
			method: 'get',
			url: 'https://discordapp.com/api/users/@me',
			headers: { 'Authorization': ' Bearer ' + req.body.token }
		})
		.then((response) => {
			let collection = db.collection('users')
			collection.findOneAndUpdate({
				'discord.username': response.data.username
			}, {
				$set: {
					'discord.avatar': response.data.avatar,
					'discord.discriminator': response.data.discriminator,
					'session': req.session.id
				}
			})
			.then((result) => {
				acl.addUserRoles(req.session.id, [ 'stats', 'admin', 'headpooler', 'mappooler', 'referee', 'player' ])
				if (!result.value) {
					collection.insertOne({
						discord: {
							username: response.data.username,
							discriminator: response.data.discriminator,
							id: response.data.id,
							avatar: response.data.avatar
						},
						session: req.session.id
					})
					.then((result) => {
						res.json({ message: 'Login successfull' })
					})
					.catch(next)
				} else {
					res.json({ message: 'Login successfull' })
				}
			})
			.catch(next)
		})
	})

	app.get('/api/discordroles', (req, res, next) => {
		let collection = db.collection('discordroles')
		collection.find({}).toArray()
		.then((roles) => {
			res.json(roles)
		})
		.catch(next)
	})

	app.post('/api/discordroles', (req, res, next) => {
		let collection = db.collection('discordroles')
		axios({
			method: 'get',
			url: 'https://discordapp.com/api/guilds/' + config.discord.guildId + '/roles',
			headers: { 'Authorization': ' Bot ' + config.discord.botToken }
		})
		.then((result) => {
			collection.deleteMany({})
			.then(() => {
				let roles = []
				for (let i = 0; i < result.data.length; i++) {
					roles.push({ name: result.data[i].name, color: result.data[i].color, id: result.data[i].id })
				}
				collection.insertMany(roles)
				.then(() => {
					res.json({ message: 'Discord roles updated' })
				})
				.catch(next)
			})
			.catch(next)
		})
		.catch(next)
	})

}