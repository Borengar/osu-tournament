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

	acl = new acl(new acl.mongodbBackend(db, 'acl_'))
	initRoles(acl)

	fs.readdir('./routes', (err, files) => {
		for (let i = 0; i < files.length; i++) {
			require('./routes/' + files[i])(app, db, acl, axios, config, ObjectId)
		}

		app.listen(80, () => {
			console.log('osu-tournament is listening on port 80!')
		})
	})
})
.catch((err) => {
	console.log(err)
})

function initRoles(acl) {
	acl.allow([
		{
			roles: 'superuser',
			allows: [
				{
					permissions: [ 'get', 'put', 'post', 'delete' ],
					resources: [ 'rounds', 'tiers', 'lobbies', 'roles', 'players', 'registrations', 'ownregistration', 'timeslots', 'availabilities', 'ownavailability', 'mappools', 'feedback', 'referee', 'profile' ]
				}
			]
		}
	])
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