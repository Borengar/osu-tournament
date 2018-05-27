const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const MongoClient = require('mongodb').MongoClient;
const session = require('express-session');
var acl = require('acl');
var history = require('connect-history-api-fallback');
var axios = require('axios');
var bodyParser = require('body-parser');

const app = express();

MongoClient.connect('mongodb://localhost:27017', {
	useNewUrlParser: true
})
.then((mongo) => {
	const db = mongo.db('tournament');
	console.log('Connected to db');

	app.use(history());

	app.use(express.static('build/static'));

	app.use(session({
		secret: 'TcXJ66Ua4zUKGg21o8o9',
		resave: false,
		saveUninitialized: true
	}));

	app.use(bodyParser.json());

	acl = new acl(new acl.mongodbBackend(db));
	setRoles(acl);
	acl.addUserRoles('uwOP1M7-O6ypxZKnJr23vbL5n4LawUCJ', 'public');

	app.post('/api/discordlogin', (req, res) => {
		axios({
			method: 'get',
			url: 'https://discordapp.com/api/users/@me',
			headers: {
				'Authorization': ' Bearer ' + req.body.token
			}
		})
		.then((response) => {
			let collection = db.collection('users');
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
						res.json({
							message: 'Login successfull'
						});
					})
					.catch((err) => {
						console.log(err);
					});
				} else {
					res.json({
						message: 'Login successfull'
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});
		});
	});

	app.get('/api/stuff', (req, res) => {
		let collection = db.collection('tiers');
		collection.find({}).toArray((err, docs) => {
			if (err) {
				res.send(err);
				return;
			}
			res.json(docs);
		});
	});

	app.post('/api/stuff', (req, res) => {
		let collection = db.collection('tiers');
		collection.insertOne({
			lowerEnd: 1,
			upperEnd: 999,
			name: '1 - 1k'
		})
		.then((result) => {
			res.json(result);
		})
		.catch((err) => {
			res.send(err);
		});
	});

	app.listen(80, () => {
		console.log('osu-tournament is listening on port 80!');
	});
})
.catch((err) => {
	console.log(err);
});

function setRoles(acl) {
	acl.allow([
		{
			roles: 'public',
			allows: [
				{
					permissions: 'get',
					resources: [ 'rounds', 'tiers', 'lobbies', 'stuff' ]
				}
			]
		}
	]);
}