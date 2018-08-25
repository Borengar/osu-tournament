const parse = require('csv-parse')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID
const fs = require('fs')

MongoClient.connect('mongodb://localhost:27017', {
	useNewUrlParser: true
})
.then((mongo) => {
	const db = mongo.db('tournament')

	let usersCollection = db.collection('users')

	let updates = []
	usersCollection.find({
		'player.nextRound._id': { $exists: true }
	}).toArray()
	.then((players) => {
		for (let i = 0; i < players.length; i++) {
			updates.push(usersCollection.findOneAndUpdate({
				'_id': ObjectId(players[i]._id)
			}, {
				$unset: {
					'player.nextRound': true
				},
				$set: {
					'player.rounds': [ ObjectId(players[i].player.nextRound._id) ]
				}
			}))
		}
		return Promise.all(updates)
	})
	.then((result) => {
		console.log('Done')
	})
	.catch((err) => {
		console.log(err)
	})
})