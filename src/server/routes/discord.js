module.exports = function(app, db, axios, config, ObjectId, discord) {

	app.post('/api/discordlogin', (req, res, next) => {
		axios({
			method: 'get',
			url: 'https://discordapp.com/api/users/@me',
			headers: { 'Authorization': ' Bearer ' + req.body.token }
		})
		.then((response) => {
			let collection = db.collection('users')
			let guild = discord.guilds.first()
			let member = guild.member(response.data.id)
			let permissions = {
				player: false,
				referee: false,
				mappooler: false,
				mappools: [],
				headpooler: false,
				admin: {
					availability: false,
					bracket: false,
					lobbies: false,
					mappoolers: false,
					players: false,
					registrations: false,
					roles: false,
					tiers: false,
					timeslots: false
				}
			}
			let roleCollection = db.collection('roles')
			roleCollection.find({}).toArray()
			.then((roles) => {
				for (let i = 0; i < roles.length; i++) {
					if (roles[i].discordRole && member._roles.includes(roles[i].discordRole)) {
						let rolePermissions = roles[i].permissions
						permissions.player = permissions.player || rolePermissions.player
						permissions.referee = permissions.referee || rolePermissions.referee
						permissions.mappooler = permissions.mappooler || rolePermissions.mappooler
						permissions.mappools.push.apply(permissions.mappools, rolePermissions.mappools)
						permissions.headpooler = permissions.headpooler || rolePermissions.headpooler
						permissions.admin.availability = permissions.admin.availability || rolePermissions.admin.availability
						permissions.admin.bracket = permissions.admin.bracket || rolePermissions.admin.bracket
						permissions.admin.lobbies = permissions.admin.lobbies || rolePermissions.admin.lobbies
						permissions.admin.mappoolers = permissions.admin.mappoolers || rolePermissions.admin.mappoolers
						permissions.admin.players = permissions.admin.players || rolePermissions.admin.players
						permissions.admin.registrations = permissions.admin.registrations || rolePermissions.admin.registrations
						permissions.admin.roles = permissions.admin.roles || rolePermissions.admin.roles
						permissions.admin.spreadsheets = permissions.admin.spreadsheets || rolePermissions.admin.spreadsheets
						permissions.admin.tiers = permissions.admin.tiers || rolePermissions.admin.tiers
						permissions.admin.timeslots = permissions.admin.timeslots || rolePermissions.admin.timeslots
					}
				}

				permissions.mappools = [...new Set(permissions.mappools)]

				collection.findOneAndUpdate({
					'discord.id': response.data.id
				}, {
					$set: {
						'discord.avatar': response.data.avatar,
						'discord.username': response.data.username,
						'discord.discriminator': response.data.discriminator,
						'session': req.session.id,
						'permissions': permissions
					}
				})
				.then((result) => {
					if (!result.value) {
						collection.insertOne({
							discord: {
								username: response.data.username,
								discriminator: response.data.discriminator,
								id: response.data.id,
								avatar: response.data.avatar
							},
							session: req.session.id,
							permissions: permissions
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
		let guild = discord.guilds.first()
		let rolesData = guild.roles.array()
		let roles = []
		for (let i = 0; i < rolesData.length; i++) {
			roles.push({ name: rolesData[i].name, color: rolesData[i].color, id: rolesData[i].id })
		}
		collection.deleteMany({})
		.then((result) => {
			collection.insertMany(roles)
			.then(() => {
				res.json({ message: 'Discord roles updated' })
			})
			.catch(next)
		})
		.catch(next)
	})

	app.get('/api/discord/members', (req, res, next) => {
		let guild = discord.guilds.first()
		let membersData = guild.members.array()
		let members = []
		for (let i = 0; i < membersData.length; i++) {
			members.push({
				id: membersData[i].user.id,
				username: membersData[i].user.username,
				discriminator: membersData[i].user.discriminator,
				avatar: membersData[i].user.avatar
			})
		}
		res.json(members)
	})

}