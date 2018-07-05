const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
var acl = require('acl')
var history = require('connect-history-api-fallback')
var axios = require('axios')
var bodyParser = require('body-parser')
const cheerio = require('cheerio')
const fs = require('fs')

const config = require('./config.json')

const app = express()

MongoClient.connect(config.mongodb.host, {
	useNewUrlParser: true
})
.then((mongo) => {
	const db = mongo.db('tournament')
	console.log('Connected to db')
	initDb(db)

	app.use(history())

	app.use(express.static('build/static'))

	app.use(session({
		secret: 'TcXJ66Ua4zUKGg21o8o9',
		resave: false,
		saveUninitialized: true,
		store: new MongoStore({
			db: db
		})
	}))

	app.use(bodyParser.json())

	acl = new acl(new acl.mongodbBackend(db, 'acl_'))
	setRoles(acl)
	acl.addUserRoles('uwOP1M7-O6ypxZKnJr23vbL5n4LawUCJ', 'public')

	fs.readdir('./src/routes', (err, files) => {
		for (let i = 0; i < files.length; i++) {
			require('./src/routes/' + files[i])(app, db, acl, axios, config)
		}

		app.listen(80, () => {
			console.log('osu-tournament is listening on port 80!')
		})
	})
})
.catch((err) => {
	console.log(err)
})

function setRoles(acl) {
	acl.allow([
		{
			roles: 'registration',
			allows: [
				{
					permissions: 'get',
					resources: [ 'user', 'osuprofile', 'tiers', 'rounds', 'timeslots' ]
				},
				{
					permissions: [ 'post', 'delete' ],
					resources: [ 'registrations' ]
				},
				{
					permissions: 'put',
					resources: [ 'user' ]
				}
			]
		},
		{
			roles: 'stats',
			allows: [
				{
					permissions: 'get',
					resources: [ 'rounds', 'tiers', 'lobbies', 'mappools', 'players' ]
				}
			]
		},
		{
			roles: 'admin',
			allows: [
				{
					permissions: 'get',
					resources: [ 'user', 'osuprofile' ]
				},
				{
					permissions: [ 'get', 'post', 'put', 'delete' ],
					resources: [ 'rounds', 'tiers', 'lobbies', 'mappoolers', 'players', 'registrations', 'discordroles', 'timeslots' ]
				}
			]
		},
		{
			roles: [ 'headpooler', 'mappooler' ],
			allows: [
				{
					permissions: 'get',
					resources: [ 'user', 'rounds', 'tiers', 'feedback' ]
				},
				{
					permissions: [ 'get', 'put', 'delete' ],
					resources: [ 'mappools' ]
				}
			]
		},
		{
			roles: 'referee',
			allows: [
				{
					permissions: 'get',
					resources: [ 'user', 'rounds', 'tiers', 'mappools' ]
				},
				{
					permissions: [ 'get', 'put' ],
					resources: [ 'lobbies' ]
				}
			]
		},
		{
			roles: 'player',
			allows: [
				{
					permissions: 'get',
					resources: [ 'rounds', 'mappools', 'lobbies' ]
				},
				{
					permissions: [ 'get', 'put' ],
					resources: [ 'user', 'feedback' ]
				}
			]
		}
	])
}

function calculateRounds(db, roundId) {
	let collection = db.collection('rounds')
	if (roundId) {
		collection.findOne({
			'_id': ObjectId(roundId)
		})
		.then((round) => {
			Promise.all([
				collection.find({
					'canContinue': true,
					'continueRound': roundId
				}).toArray(),
				collection.find({
					'canDropDown': true,
					'dropDownRound': roundId
				}).toArray()
			])
			.then(([continueRounds, dropDownRounds]) => {
				let playerAmount = 0
				for (let i = 0; i < continueRounds.length; i++) {
					playerAmount += continueRounds[i].playerAmount / continueRounds[i].lobbySize * continueRounds[i].continueAmount
				}
				for (let i = 0; i < dropDownRounds.length; i++) {
					playerAmount += dropDownRounds[i].playerAmount / dropDownRounds[i].lobbySize * dropDownRounds[i].dropDownAmount
				}
				collection.findOneAndUpdate({
					'_id': ObjectId(roundId)
				}, {
					$set: {
						'playerAmount': playerAmount
					}
				})
				.then((result) => {
					if (round.canContinue && round.continueRound) {
						calculateRounds(db, round.continueRound)
					}
					if (round.canDropDown && round.dropDownRound) {
						calculateRounds(db, round.dropDownRound)
					}
				})
				.catch((err) => {
					console.log(err)
				})
			})
			.catch((err) => {
				console.log(err)
			})
		})
		.catch((err) => {
			console.log(err)
		})
	} else {
		collection.findOne({
			'firstRound': true
		})
		.then((round) => {
			if (round) {
				if (round.canContinue && round.continueRound) {
					calculateRounds(db, round.continueRound)
				}
				if (round.canDropDown && round.dropDownRound) {
					calculateRounds(db, round.dropDownRound)
				}
			}
		})
		.catch((err) => {
			console.log(err)
		})
	}
}

function initDb(db) {
	let collection = db.collection('settings')
	collection.find({}).toArray()
	.then((result) => {
		if (result.length == 0) {
			collection.insertOne({
				roles: {
					admin: null,
					headpooler: null,
					mappooler: null,
					referee: null,
					player: null
				}
			})
			.catch((err) => {
				console.log(err)
			})
		}
	})
	.catch((err) => {
		console.log(err)
	})
}