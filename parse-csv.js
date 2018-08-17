const parse = require('csv-parse')
const MongoClient = require('mongodb').MongoClient
const fs = require('fs')

MongoClient.connect('mongodb://localhost:27017', {
	useNewUrlParser: true
})
.then((mongo) => {
	const db = mongo.db('tournament')

	let usersCollection = db.collection('users')
	let tiersCollection = db.collection('tiers')
	let roundsCollection = db.collection('rounds')
	Promise.all([tiersCollection.find({}).toArray(), roundsCollection.find({}).toArray()])
	.then(([tiers, rounds]) => {

		fs.readFile('C:\\Users\\krame\\Downloads\\happysticktour.csv\\happysticktour_table_players.csv', 'utf8', (err, contents) => {
			parse(contents, (err, output) => {
				var csvPlayers = output

				for (var i = 0; i < csvPlayers.length; i++) {
					let tierName = ''
					switch (csvPlayers[i][4]) {
						case '21': tierName = '1 - 1k'; break
						case '22': tierName = '1k - 7k'; break
						case '23': tierName = '7k - 18k'; break
						case '24': tierName = '18k - 35k'; break
						case '25': tierName = '35k - 55k'; break
						case '26': tierName = '55k - 80k'; break
					}

					if (tierName) {
						let tier = tiers.find((tier) => { return tier.name == tierName })
						usersCollection.findOneAndUpdate({
							'osu.id': parseInt(csvPlayers[i][2])
						}, {
							$set: {
								'player': {
									tier: tier,
									currentLobby: null,
									nextRound: rounds.find((round) => { return round._id == tier.startingRound })
								}
							}
						})
						.then((result) => {
							// nothing
						})
						.catch((err) => {
							console.log(err)
						})
					}
				}
			})

				/*
				fs.readFile('C:\\Users\\krame\\Downloads\\happysticktour.csv\\happysticktour_table_discord_users.csv', 'utf8', (err, contents) => {
					parse(contents, (err, output) => {
						var csvDiscord = output
						var players = []
						for (var i = 0; i < csvPlayers.length; i++) {
							var discordItem = csvDiscord.find((item) => {
								return item[0] == csvPlayers[i][1]
							})
							if (discordItem) {
								players.push({
									osu: {
										id: parseInt(csvPlayers[i][2])
									},
									discord: {
										id: discordItem[0],
										username: discordItem[1],
										discriminator: discordItem[2],
										avatar: discordItem[3]
									}
								})
							}
						}
						let collection = db.collection('users')

						collection.insertMany(players)
						.then((result) => {
							console.log('finished')
						})
						.catch((err) => {
							console.log(err)
						})
					})
				})
			})
			*/
		})
	})
})