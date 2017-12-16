var http = require('http'); // this is new
var express = require('express'); var app = express();
var server = http.createServer(app); // this is newf
var io = require('socket.io').listen(server);
var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://messages.db.sqlite');
var engines = require('consolidate');

app.engine('html' , engines.hogan); // tell Express to run .html files through Hulk Hogan
app.set('views', __dirname + '/templates'); // tell Express where to find templates.
app.use(express.static(__dirname + '/public'));

app.get('/' , function(request , response){//brings client to home page
	var rooms = [];//gets rooms to display
	conn.query("SELECT DISTINCT room FROM messages").on('data' , function(row){
		rooms.push(row);
	});
	response.render('Home.html', {roomList: rooms});//renders home page
});

app.get('/:roomName', function(request, response){//Gets chatroom page template.
	response.render('Chat.html', {roomName: request.params.roomName});
});

app.post('/' , function(request, response){//allows new chatrooms to be created
	var newRoom = generateRoomIdentifier();
	response.redirect('/' + newRoom);
	response.render('Chat.html', {roomName: newRoom});
});


io.sockets.on('connection', function(socket){//runs when client is connecte
	socket.on('join', function(roomName, nickname, callback){//run when client joins service
		socket.join(roomName); // this is a socket.io method socket.nickname = nickname; // yay JavaScript! see below//sets this persons nickname
		socket.nickname = nickname;//gives the socket a nickname property and then asigns the nickname value to it
		socket.roomName = roomName;
		var messages = [];
		conn.query('SELECT * FROM messages WHERE room = ($1);', [roomName])
		.on('data', function(row){
			messages.push(row);
		})
		.on('end', function(){
			callback(messages);
		});
		broadcastMembership(roomName);
	});

	socket.on('nicknameChange', function(roomName, nickname){
		io.sockets.in(roomName).emit("membershipChanged", function(Nickname){// this gets emitted if a user changes their nickname
			var oldName = socket.nickname;
			socket.nickname = nickname; // Change to return new list of people
			broadcastMembership(roomName);
		});
	});
	socket.on('chat message', function(nickname, msg){//receiving chat message
		var roomName = socket.roomName
		conn.query('INSERT INTO messages (room, nickname, body, time) VALUES ($1 , $2, $3, $4); ', [roomName, nickname, msg, null]);
		io.sockets.in(roomName).emit('server message update', nickname, msg); //sends message to everyone 
	});
		// the client disconnected/closed their browser window
	socket.on('disconnect', function(){
		io.sockets.emit('getRoomName');
	});
	socket.on('returnRoomName', function(roomName){
		broadcastMembership(roomName);
	});
});
function generateRoomIdentifier(){
	var chars = 'WwEeDd420';
	var result = '';
	for(var i = 0; i < 6; i++)
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	return result;
};
function broadcastMembership(roomName) { // fetch all sockets in a room
	var sockets = io.sockets.clients(roomName);
	var nicknames = sockets.map(function(socket){
		return socket.nickname; 
	});
	io.sockets.in(roomName).emit('ChangeMembership', nicknames);
};
/*function updatedatabase(Nickname, oldname){
	conn.query('UPDATE messages SET nickname = $1 WHERE nickname = $2; ', [Nickname,oldName])
}*///ran out of time
server.listen(8080);
