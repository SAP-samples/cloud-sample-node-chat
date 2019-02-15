const gravatar = require('gravatar');
const pg = require('pg');
const cfenv = require("cfenv");

const appEnv = cfenv.getAppEnv()

const config = {
	user: appEnv.services.postgresql[0].credentials.username,
	database: appEnv.services.postgresql[0].credentials.dbname,
	password: appEnv.services.postgresql[0].credentials.password,
	host: appEnv.services.postgresql[0].credentials.hostname,
	port: appEnv.services.postgresql[0].credentials.port,
	max: 10,
	idleTimeoutMillis: 30000
};

// For Local postgres connection
/* 
var config = {
  user: 'postgres', //env var: PGUSER
  database: 'postgres', //env var: PGDATABASE
  password: 'test', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
};
 */

//Get the Database Connection using the Connection pool.

const readTable = 'SELECT * FROM chats';

const pool = new pg.Pool(config);


// Export a function, so that we can pass 
// the app and io instances from the app.js file:

module.exports = function (app, io) {

	var roomGenerator = 0; 

	app.get('/', (req, res) => {

		res.render('home');
	});

	app.get('/create', (req, res) => {

		roomGenerator+=1;
		var id = Math.round((roomGenerator));
		res.redirect('/chat/' + id);
	});

	app.get('/chat/:id',  (req, res) => {

		// Render the chat.html view
		res.render('chat');
	});

	// Initialize a new socket.io application, named 'chat'
	var chat = io.on('connection', function (socket) {

		// When the client emits the 'load' event, reply with the 
		// number of people in this chat room

		socket.on('load', (data) => {

			var room = findClients(io, data);
			if (room.length === 0) {

				socket.emit('peopleinchat', {
					number: 0
				});
			} else if (room.length === 1) {

				socket.emit('peopleinchat', {
					number: 1,
					user: room[0].username,
					avatar: room[0].avatar,
					id: data
				});
			} else if (room.length > 1) {

				chat.emit('tooMany', {
					boolean: true
				});
			}
		});

		// When the client emits 'login', save his name and avatar,
		// and add them to the room
		socket.on('login', function (data) {

			console.log("data === ", data);

			var id = data.id;
			var email = data.avatar;
			var user = data.user;

			var insertRecord = 'INSERT INTO userInfo(name,mail) VALUES($1,$2)';

			pool.query(insertRecord, [user, email])
				.then(res => {
					console.log("User info addded");
				})
				.catch(err => {
					console.log("Error in adding userinfo", err)
				})

			var room = findClients(io, data.id);
			// Only two people per room are allowed
			if (room.length < 2) {

				// Use the socket object to store data. Each client gets
				// their own unique socket object

				socket.username = data.user;
				socket.room = data.id;
				socket.avatar = gravatar.url(data.avatar, {
					s: '140',
					r: 'x',
					d: 'mm'
				});

				// Tell the person what he should use for an avatar
				socket.emit('img', socket.avatar);


				// Add the client to the room
				socket.join(data.id);

				if (room.length == 1) {

					var usernames = [],
						avatars = [];

					usernames.push(room[0].username);
					usernames.push(socket.username);

					avatars.push(room[0].avatar);
					avatars.push(socket.avatar);

					// Send the startChat event to all the people in the
					// room, along with a list of people that are in it.

					chat.in(data.id).emit('startChat', {
						boolean: true,
						id: data.id,
						users: usernames,
						avatars: avatars
					});
				}
			} else {
				socket.emit('tooMany', {
					boolean: true
				});
			}
		});

		// Notify others When somebody has left the chat
		socket.on('disconnect', () => {

			// Notify the other person in the chat room
			// that his partner has left

			socket.broadcast.to(this.room).emit('leave', {
				boolean: true,
				room: this.room,
				user: this.username,
				avatar: this.avatar
			});

			// leave the room
			socket.leave(socket.room);
		});


		// Send message to people in a room
		socket.on('msg', function (data) {
			var message = data.msg;
			var user = data.user;

			var insertRecord = 'INSERT INTO chats(userId,msg) VALUES((select id from userInfo where name=$1),$2)';

			pool.query(insertRecord, [user, message])
				.then(res => {
					console.log("Chat message added");
				})
				.catch(err => {
					console.log("Error adding chat message", err);
				});

			// When the server receives a message, it sends it to the other person in the room.
			socket.broadcast.to(socket.room).emit('receive', {
				msg: data.msg,
				user: data.user,
				img: data.img
			});

			// add code here to insert to table

		});
	});
};

function findClients(io, roomId, namespace) {
	var res = [],
		ns = io.of(namespace || "/"); 

	if (ns) {
		for (var id in ns.connected) {
			if (roomId) {
				var index = ns.connected[id].rooms;
				if (index.hasOwnProperty(roomId)) {
					res.push(ns.connected[id]);
				}
			} else {
				res.push(ns.connected[id]);
			}
		}
	}
	return res;
}