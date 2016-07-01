'use strict';

const Express = require('express');
const app = Express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);

app.use(Express.static(`${__dirname}/lib`));
app.use(Express.static(`${__dirname}/public`));
app.use('*', (_, res) => res.sendFile(`${__dirname}/index.html`));

let users = {};

io.sockets.on('connection', (socket) =>{

	socket.on('chat:send', function (data) {
		io.sockets.emit('chat:update', socket.username, data);
	});

	socket.on('chat:adduser', function (username) {
		socket.username = users[username] = username;
		const publicMsg = `${username} has connected!`,
			privateMsg = 'you have connected!';
		socket.emit('chat:update', 'SERVER', privateMsg);
		socket.broadcast.emit('chat:update', 'SERVER', publicMsg);
		io.sockets.emit('chat:updateusers', users);
	});

	socket.on('disconnect', function () {
		delete users[socket.username];
		io.sockets.emit('chat:updateusers', users);
		const msg = `${socket.username} has disconnected`;
		socket.broadcast.emit('chat:update', 'SERVER', msg);
	});

})


const PORT = 8000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

