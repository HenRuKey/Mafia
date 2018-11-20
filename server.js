var express = require("express");
var app = express();
var path = require("path");
let http = require('http').Server(app);
let io = require('socket.io')(http);
var bodyParser = require("body-parser");

var index = require("./routes/index")
var rooms = require("./routes/rooms");
var lobby = require("./routes/lobby")

io.on('connection', (socket) => {

    // Log whenever a user connects
    console.log('user connected');
    io.emit("hi", "Server Success");

    // Log whenever a client disconnects from our websocket server
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    // When we receive a 'message' event from our client, print out
    // the contents of that message and then echo it back to our client
    // using `io.emit()`
    socket.on('Create Room', () => {
        console.log("Creatinng Room: ");
        socket.join("ROOM")
        socket.emit('Send Code', { code: "ROOM"});
    });
});

app.set('views', [__dirname + '/views', __dirname + "/src" ]);
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, 'client')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', index);
app.use('/rooms', rooms);
app.use('/lobby', lobby)




http.listen(3000, function () {
    console.log('server started on port 3000');
})