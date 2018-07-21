const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
var history = require('connect-history-api-fallback')
var axios = require('axios')
var bodyParser = require('body-parser')
const cheerio = require('cheerio')
const fs = require('fs')
const DiscordJS = require('discord.js')
const OsuApi = require('./osuApi.js')

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

	app.use(express.static('../../build/static'))

	app.use(session({
		secret: 'TcXJ66Ua4zUKGg21o8o9',
		resave: false,
		saveUninitialized: true,
		store: new MongoStore({
			db: db
		})
	}))

	app.use(bodyParser.json())

	app.use((req, res, next) => {
		if (req.session.id) {

		}
		next()
	})

	const osu = new OsuApi({
		apiKey: config.osu.apiKey,
		username: config.osu.username,
		password: config.osu.password
	})
	osu.connect()
	.then(() => {
		console.log('osu! API connected')

		const discord = new DiscordJS.Client()
		discord.login(config.discord.botToken)
		.then((botToken) => {
			console.log('Discord API connected')
			fs.readdir('./routes', (err, files) => {
				for (let i = 0; i < files.length; i++) {
					require('./routes/' + files[i])(app, db, axios, config, ObjectId, discord, osu)
				}

				app.listen(80, () => {
					console.log('webserver is running')
				})
			})
		})
	})
	.catch((err) => {
		console.log(err)
	})
})
.catch((err) => {
	console.log(err)
})

function initDb(db) {
	let collection = db.collection('roles')
	collection.find({}).toArray()
	.then((result) => {
		if (result.length == 0) {
			return collection.insertOne({
				name: 'superuser',
				discordRole: '',
				permissions: {
					player: true,
					referee: true,
					mappooler: true,
					mappools: [],
					headpooler: true,
					admin: {
						availability: true,
						bracket: true,
						lobbies: true,
						mappoolers: true,
						players: true,
						registrations: true,
						roles: true,
						spreadsheets: true,
						tiers: true,
						timeslots: true
					}
				}
			})
		}
	})
	.then((result) => {
		console.log('Roles initialized')
	})
	.catch((err) => {
		console.log(err)
	})

	let settingsCollection = db.collection('settings')
	settingsCollection.find({}).toArray()
	.then((result) => {
		if (result.length == 0) {
			return settingsCollection.insertOne({
				registration: {
					active: false,
					openDate: null,
					openTime: null,
					closeDate: null,
					closeTime: null
				}
			})
		}
		return Promise.resolve()
	})
	.then((result) => {
		console.log('Settings initialized')
	})
	.catch((err) => {
		console.log(err)
	})
}