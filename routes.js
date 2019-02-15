const gravatar = require('gravatar');

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

		res.render('chat');
	});

	// Initialize a new socket.io application, named 'chat'
	var chat = io.on('connection', function (socket) {

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

		// add clients to the room
		socket.on('login', function (data) {

			var id = data.id;
			var email = data.avatar;
			var user = data.user;

			var room = findClients(io, data.id);
			
			if (room.length < 2) {

				socket.username = data.user;
				socket.room = data.id;
				socket.avatar = gravatar.url(data.avatar, {
					s: '140',
					r: 'x',
					d: 'mm'
				});

				socket.emit('img', socket.avatar);


				socket.join(data.id);

				if (room.length == 1) {

					var usernames = [],
						avatars = [];

					usernames.push(room[0].username);
					usernames.push(socket.username);

					avatars.push(room[0].avatar);
					avatars.push(socket.avatar);

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

			socket.broadcast.to(this.room).emit('leave', {
				boolean: true,
				room: this.room,
				user: this.username,
				avatar: this.avatar
			});

			socket.leave(socket.room);
		});


		// Send message to people in a room
		socket.on('msg', function (data) {
			var message = data.msg;
			var user = data.user;

			socket.broadcast.to(socket.room).emit('receive', {
				msg: data.msg,
				user: data.user,
				img: data.img
			});

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