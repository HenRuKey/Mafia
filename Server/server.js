var cors = require('cors');
var express = require("express");
var app = express();
var http = require('http').Server(app);
var mongojs = require('mongojs');
var db = mongojs('mongodb://bryan:mafiadb1@ds029267.mlab.com:29267/game_info', ['rooms', 'players', 'messages'], { autoReconnect: true });
var bodyParser = require('body-parser');
var exprationLimit = 86400000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//Returns all rooms
app.get("/api", (req, res) => {
    console.log("Hit 1")
    db.rooms.find(function (err, rooms) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        res.json(rooms);
    });
})

//Returns the room matching the code
app.get("/api/room/:code", (req, res) => {
    console.log("Hit 2")
    var query = { roomCode: req.params.code }
    db.rooms.findOne(query, function (err, room) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        if (room != null) {
            console.log("Room exists")
            var oldDate = parseInt(room.created)
            var newDate = Date.now();
            if (newDate - oldDate >= exprationLimit) {
                db.rooms.remove(room);
                db.messages.remove(query);
                db.players.remove(query);
                room = null;
            }
        }
        res.json(room);
    });
})


//Creates a room with a given code.
app.post("/api/create/:code", (req, res) => {
    console.log("Hit 3")
    var room = {
        roomCode: req.params.code,
        created: "1543791424251"
    }
    var id = room.roomCode;
    if (!id) {
        res.status(400);
        res.json("Invalid Data");
    } else {
        db.rooms.save(room, function (err, room) {
            if (err) {
                res.send(err);
            }
            res.json(room);
        })
    }

});





// Delete the room with the matching code
app.delete("/api/deleteRoom/:code", (req, res) => {
    console.log("Hit 4")
    var id = req.params.code;
    if (!id) {
        res.status(400);
        res.json("Invalid Data");
    } else {
        db.rooms.remove({ roomCode: id }, function (err, room) {
            if (err) {
                res.send(err);
            }
            res.json("Deleted");
        })
    }
})


// Add Player
app.post("/api/addPlayer", (req, res) => {
    console.log("Hit 5")
    var player = req.body
    if (!player) {
        res.status(400);
        res.json("Invalid Data");
    } else {
        db.players.save(player, function (err, player) {
            if (err) {
                res.send(err);
            }
            res.json(player);
        })
    }
})

// Get Player from room
app.get("/api/player", (req, res) => {
    console.log("Hit 6");
    var query = { roomCode: req.query.code, name: req.query.name };
    db.players.findOne(query, function (err, player) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        res.json(player);
    });
})


// Get All Players in Room by code
app.get("/api/allPlayers/:code", (req, res) => {
    console.log("Hit 7")
    var query = { roomCode: req.params.code }
    db.players.find(query, function (err, players) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        res.json(players);
    });

});


// Add Message
app.post("/api/addMessage", (req, res) => {
    console.log("Hit 8")
    var message = req.body
    if (!name) {
        res.status(400);
        res.json("Invalid Data");
    } else {
        db.messages.save(message, function (err, message) {
            if (err) {
                res.send(err);
            }
            res.json(message);
        })
    }
})


// Get All Messages by Code
app.get("/api/allMessages/:code", (req, res) => {
    console.log("Hit 9")
    var query = { roomCode: req.params.code }
    db.messages.find(query, function (err, players) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        res.json(players);
    });

});







http.listen(3000, function () {
    console.log('server started on port 3000');
})